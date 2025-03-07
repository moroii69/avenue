import React from "react";

export function Tabs({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className = "", selectedValue = "" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const dropdownRef = React.useRef(null);

  // Auto-select first tab on mount
  React.useEffect(() => {
    if (selectedValue) {
      const selectedChild = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.props.value === selectedValue
      );
  
      if (selectedChild) {
        setSelected(selectedChild.props.children);
      }
    }
  }, [selectedValue, children]); // Run when selectedValue changes
  
  // Add click outside handler
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clone children and add onSelect prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onSelect: () => {
          setIsOpen(false);
          setSelected(child.props.children);
        },
        ...child.props,
      });
    }
    return child;
  });

  return (
    <div className="relative w-full @container" ref={dropdownRef}>
      <div
        className={`md:w-fit @4xl:flex md:overflow-hidden md:h-10 md:items-center md:justify-center md:gap-2 w-full hidden ${className}`}
      >
        {childrenWithProps}
      </div>

      {/* Mobile dropdown */}
      <div className="@4xl:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-white/5 text-sm rounded-lg flex items-center justify-between gap-2 capitalize border border-white/10"
        >
          <span className="flex items-center gap-2">
            {selected || "Select Option"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute border border-white/10 top-full left-0 w-full mt-1 backdrop-blur-[100px] bg-[#1A1A1A] rounded-lg z-10">
            <div className="relative z-10 p-1 grid gap-1">
              {childrenWithProps}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TabTrigger({
  children,
  value,
  onClick,
  onSelect,
  className = "",
}) {
  return (
    <button
      className={`w-full @4xl:w-fit rounded-lg mx-auto md:h-8 flex items-center justify-start text-sm text-left ${className}`}
      onClick={() => {
        onClick?.();
        onSelect?.();
      }}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children, className = "" }) {
  if (value !== activeTab) return null;
  return <div className={className}>{children}</div>;
}