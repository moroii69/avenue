import React from "react";

interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  selectedValue?: string;
}

interface TabTriggerProps {
  children: React.ReactNode;
  value: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  onSelect?: () => void;
}

interface TabsContentProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ children, className = "" }: TabsProps) {
  return <div className={className}>{children}</div>;
}

export function TabsList({
  children,
  className = "",
  selectedValue = "",
}: TabsListProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Auto-select first tab on mount
  React.useEffect(() => {
    const firstChild = React.Children.toArray(children).find(
      (child): child is React.ReactElement<TabTriggerProps> =>
        React.isValidElement(child) && "value" in child.props
    );

    if (firstChild) {
      setSelected(firstChild.props.children as string);
    }
  }, []); // Only run once on mount

  // Add click outside handler
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
          setSelected(child.props.children as string);
        },
        ...child.props,
      });
    }
    return child;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`md:w-fit md:flex md:rounded-full md:overflow-hidden md:bg-white/5 md:h-10 md:px-1 md:items-center md:justify-center md:gap-2 w-full hidden ${className}`}
      >
        {childrenWithProps}
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-white/5 text-sm rounded-lg flex items-center justify-between gap-2 capitalize"
        >
          <span className="flex items-center gap-2">
            {selected || "Select Option"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
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
          <div className="absolute top-full left-0 w-full mt-1 backdrop-blur-3xl rounded-lg overflow-hidden z-50 py-1 grid gap-1">
            {childrenWithProps}
          </div>
        )}
      </div>
    </div>
  );
}

export function TabTrigger({
  children,
  value,
  active,
  onClick,
  onSelect,
  className = "",
}: TabTriggerProps) {
  return (
    <button
      className={`w-[98%] mx-auto md:h-8 md:w-fit md:px-1 md:pl-2 md:rounded-full text-sm px-4 py-2 text-left rounded-md hover:bg-white/5 ${
        active ? "bg-white/10" : ""
      } ${className}`}
      onClick={() => {
        onClick?.();
        onSelect?.();
      }}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  activeTab,
  children,
  className = "",
}: TabsContentProps) {
  if (value !== activeTab) return null;
  return <div className={className}>{children}</div>;
}
