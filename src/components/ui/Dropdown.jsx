import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DropdownContext, useDropdown } from "../../contexts/dropdown-context";

export function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <DropdownContext.Provider
      value={{ open, setOpen, placement, setPlacement }}
    >
      <div ref={ref} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownTrigger({ children, className = "" }) {
  const { open, setOpen } = useDropdown();

  return React.cloneElement(children, {
    onClick: () => setOpen(!open),
    className: `${children.props.className || ""} ${className}`,
  });
}

DropdownTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function DropdownContent({
  children,
  className = "",
  align = "left",
  preferredPlacement = "bottom",
}) {
  const { open, placement, setPlacement } = useDropdown();
  const contentRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: 0, right: "auto" });

  useEffect(() => {
    if (open && contentRef.current) {
      setMounted(true);
      const rect = contentRef.current.getBoundingClientRect();
      const parentRect =
        contentRef.current.parentElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const spaceAbove = parentRect.top;
      const spaceBelow = window.innerHeight - parentRect.bottom;
      const contentHeight = rect.height;

      // Handle vertical placement
      let newPlacement = preferredPlacement;
      if (
        preferredPlacement === "bottom" &&
        spaceBelow < contentHeight &&
        spaceAbove > spaceBelow
      ) {
        newPlacement = "top";
      } else if (
        preferredPlacement === "top" &&
        spaceAbove < contentHeight &&
        spaceBelow > spaceAbove
      ) {
        newPlacement = "bottom";
      }
      setPlacement(newPlacement);

      // Handle horizontal position to prevent overflow
      let leftPosition = 0;
      if (align === "right") {
        leftPosition = "auto";
      } else if (align === "center") {
        leftPosition = -rect.width / 2 + parentRect.width / 2;
      }

      // Ensure the dropdown doesn't overflow the screen
      if (align !== "right" && typeof leftPosition === "number") {
        const dropdownRight = parentRect.left + leftPosition + rect.width;
        const dropdownLeft = parentRect.left + leftPosition;

        if (dropdownRight > viewportWidth - 16) {
          // If overflowing right, align to right edge with padding
          setPosition({ left: "auto", right: 0 });
        } else if (dropdownLeft < 16) {
          // If overflowing left, align to left edge with padding
          setPosition({ left: 0, right: "auto" });
        } else {
          setPosition({ left: leftPosition, right: "auto" });
        }
      } else {
        setPosition({
          left: leftPosition,
          right: align === "right" ? 0 : "auto",
        });
      }
    }
  }, [open, preferredPlacement, setPlacement, align]);

  if (!open) return null;

  const placementClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 min-w-[200px] ${placementClasses[placement]} ${className}`}
      style={{
        visibility: mounted ? "visible" : "hidden",
        left: position.left,
        right: position.right,
        opacity: mounted ? 1 : 0,
        transition: "opacity 150ms ease-out",
      }}
    >
      {children}
    </div>
  );
}

DropdownContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(["left", "right", "center"]),
  preferredPlacement: PropTypes.oneOf(["top", "bottom"]),
};

export function DropdownItem({
  children,
  className = "",
  onClick,
  disabled = false,
}) {
  const { setOpen } = useDropdown();

  const handleClick = (e) => {
    if (!disabled) {
      onClick?.(e);
      setOpen(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer text-sm ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export function DropdownSeparator({ className = "" }) {
  return <div className={`border-t border-white/10 my-1 ${className}`} />;
}

DropdownSeparator.propTypes = {
  className: PropTypes.string,
};
