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

export function DropdownTrigger({ children, className = "" }) {
  const { open, setOpen } = useDropdown();

  return React.cloneElement(children, {
    onClick: () => setOpen(!open),
    className: `${children.props.className || ""} ${className}`,
  });
}

export function DropdownContent({
  children,
  className = "",
  align = "right",
  preferredPlacement = "bottom",
}) {
  const { open, placement, setPlacement } = useDropdown();
  const contentRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open && contentRef.current) {
      setMounted(true);
      const rect = contentRef.current.getBoundingClientRect();
      const parentRect =
        contentRef.current.parentElement.getBoundingClientRect();
      const spaceAbove = parentRect.top;
      const spaceBelow = window.innerHeight - parentRect.bottom;
      const contentHeight = rect.height;

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
    }
  }, [open, preferredPlacement, setPlacement]);

  if (!open) return null;

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  const placementClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 ${alignmentClasses[align]} ${placementClasses[placement]} ${className}`}
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      {children}
    </div>
  );
}

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

export function DropdownSeparator({ className = "" }) {
  return <div className={`border-t border-white/10 my-1 ${className}`} />;
}