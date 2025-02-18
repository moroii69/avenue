import React, { useEffect, createContext, useContext, useState } from "react";

const DialogContext = createContext(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a Dialog");
  }
  return context;
}

export const Dialog = ({
  children,
  className = "",
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const onClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setUncontrolledOpen(false);
    }
  };
  const onOpen = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setUncontrolledOpen(true);
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore scrolling when dialog is closed
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <DialogContext.Provider value={{ isOpen, onClose, onOpen }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed left-1/2 bottom-5 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[95%] max-w-[400px] bg-[#111111] rounded-3xl p-6 z-50 h-fit ${className}`}
      >
        {children}
      </div>
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({
  children,
  className = "",
  asChild = false,
}) => {
  const { onOpen } = useDialog();

  if (asChild) {
    return React.cloneElement(children, {
      onClick: onOpen,
      className: `${children.props.className || ""} ${className}`,
    });
  }

  return (
    <button
      onClick={onOpen}
      className={`text-white focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-white text-xl font-medium tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
};

export const DialogDescription = ({ children, className = "" }) => {
  return <p className={`text-sm text-white/60 ${className}`}>{children}</p>;
};

export const DialogContent = ({ children, className = "" }) => {
  const { onClose } = useDialog();

  return (
    <div className={`flex flex-col gap-3 relative ${className}`}>
      <button
        onClick={onClose}
        className="absolute right-2 top-2 text-white/60 hover:text-white border border-white/10 rounded-lg p-1 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 5L5 15M5 5L15 15" />
        </svg>
      </button>
      {children}
    </div>
  );
};
