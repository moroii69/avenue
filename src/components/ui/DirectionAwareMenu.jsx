import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function DirectionAwareMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({});
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current || !menuRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate available space in each direction
    const spaceAbove = buttonRect.top;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceLeft = buttonRect.left;
    const spaceRight = windowWidth - buttonRect.right;

    const newPosition = {};

    // Determine vertical position
    if (spaceBelow >= menuRect.height) {
      // Enough space below
      newPosition.top = buttonRect.bottom + 8;
    } else if (spaceAbove >= menuRect.height) {
      // Not enough space below, but enough space above
      newPosition.bottom = windowHeight - buttonRect.top + 8;
    } else {
      // Not enough space above or below, center it vertically
      newPosition.top = Math.max(8, windowHeight / 2 - menuRect.height / 2);
    }

    // Determine horizontal position
    if (spaceRight >= menuRect.width) {
      // Enough space to the right
      newPosition.left = buttonRect.left;
    } else if (spaceLeft >= menuRect.width) {
      // Not enough space right, but enough space left
      newPosition.right = windowWidth - buttonRect.right;
    } else {
      // Not enough space left or right, center it horizontally
      newPosition.left = Math.max(8, windowWidth / 2 - menuRect.width / 2);
    }

    setPosition(newPosition);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) {
        updatePosition();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      setTimeout(updatePosition, 0);
    }
    setIsOpen(!isOpen);
  };

  // Find the MenuTrigger and other children
  const trigger = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === MenuTrigger
  );
  const menuItems = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type !== MenuTrigger
  );

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          ref: buttonRef,
          onClick: handleToggle,
          isOpen,
        })}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              ...position,
            }}
            className="z-10 bg-[#151515] border border-white/10 rounded-xl shadow-lg min-w-[180px]"
          >
            {menuItems}
          </div>,
          document.body
        )}
    </>
  );
}

export const MenuTrigger = React.forwardRef(
  ({ children, className, isOpen, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`transition-colors ${
          isOpen ? "text-white" : "text-gray-400 hover:text-white"
        } ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MenuTrigger.displayName = "MenuTrigger";

export function MenuItem({ onClick, children, variant }) {
  return (
    <button
      onClick={onClick}
      className={`w-full mx-auto text-sm tracking-wide p-1 rounded-lg flex items-center gap-2 text-left
        ${variant === "danger" ? "text-red-500" : "text-white"}`}
    >
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="border-t border-white/10" />;
}