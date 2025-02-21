import React, { useState, useEffect, useRef, useCallback } from "react";
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
  preferredPlacement = "bottom",
}) {
  const { open, setPlacement } = useDropdown();
  const contentRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const updatePosition = useCallback(() => {
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const parentRect =
        contentRef.current.parentElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check vertical placement
      const spaceAbove = parentRect.top;
      const spaceBelow = viewportHeight - parentRect.bottom;
      const contentHeight = rect.height;

      let newPlacement = preferredPlacement;
      if (
        preferredPlacement === "bottom" &&
        spaceBelow < contentHeight &&
        spaceAbove > contentHeight
      ) {
        newPlacement = "top";
      } else if (
        preferredPlacement === "top" &&
        spaceAbove < contentHeight &&
        spaceBelow > contentHeight
      ) {
        newPlacement = "bottom";
      }
      setPlacement(newPlacement);

      // Get trigger button element
      const triggerButton =
        contentRef.current.parentElement.querySelector("button");
      if (triggerButton) {
        const triggerRect = triggerButton.getBoundingClientRect();

        // Calculate horizontal position
        let leftPosition = triggerRect.left;
        if (leftPosition + rect.width > viewportWidth - 16) {
          // If dropdown would overflow right edge, align to right edge with padding
          leftPosition = viewportWidth - rect.width - 16;
        }
        // Ensure dropdown doesn't overflow left edge
        leftPosition = Math.max(16, leftPosition);

        // Calculate vertical position
        const topPosition =
          newPlacement === "bottom"
            ? triggerRect.bottom + 8
            : triggerRect.top - contentHeight - 8;

        // Apply the position
        contentRef.current.style.position = "fixed";
        contentRef.current.style.left = `${leftPosition}px`;
        contentRef.current.style.top = `${topPosition}px`;

        // Ensure the content is visible
        contentRef.current.style.opacity = "1";
        contentRef.current.style.transform = "none";
      }
    }
  }, [preferredPlacement, setPlacement]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Small delay to ensure the content is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });

      // Add resize and scroll listeners
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [open, updatePosition]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`fixed z-50 min-w-[200px] ${className}`}
      style={{
        visibility: mounted ? "visible" : "hidden",
        opacity: 0,
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
      className={`cursor-pointer text-sm border-b last:border-b-0 border-white/10 ${
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
