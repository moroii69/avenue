import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const DropdownContext = createContext(null);

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
}

export function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
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
    <DropdownContext.Provider value={{ open, setOpen }}>
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
  align = "right", // Can be 'left', 'right', or 'center'
}) {
  const { open } = useDropdown();
  if (!open) return null;

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`absolute mt-2 z-50 ${alignmentClasses[align]} ${className}`}
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
