import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DirectionAwareMenuProps {
  children: React.ReactNode;
}

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export function DirectionAwareMenu({ children }: DirectionAwareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

    const newPosition: Position = {};

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
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
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
        React.cloneElement(trigger as React.ReactElement, {
          ref: buttonRef,
          onClick: handleToggle,
        })}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              ...position,
            }}
            className="z-10 bg-[#151515] border border-white/10 rounded-lg shadow-lg py-1 min-w-[180px]"
          >
            {menuItems}
          </div>,
          document.body
        )}
    </>
  );
}

interface MenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuTriggerProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`text-gray-400 hover:text-white transition-colors ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
});

MenuTrigger.displayName = "MenuTrigger";

export function MenuItem({
  onClick,
  children,
  variant,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={`w-[95%] mx-auto text-sm tracking-wide p-2 py-1.5 rounded-md flex items-center gap-2 text-left hover:bg-white/5 transition-colors
        ${variant === "danger" ? "text-red-500" : "text-white"}`}
    >
      {children}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 border-t border-white/10" />;
}
