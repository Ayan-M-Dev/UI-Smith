"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type ModalProps, modalPropsSchema } from "@/schemas/modal.schema";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

/**
 * Modal Component
 * ===============
 * A versatile modal/dialog component with animations and multiple variants.
 */

// Get Lucide icon by name
function getIcon(name: string | undefined): React.ElementType | null {
  if (!name) return null;
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (LucideIcons as Record<string, React.ElementType>)[pascalName] || null;
}

// Size classes
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw] max-h-[90vh]",
};

// Position classes
const positionClasses = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-20",
  bottom: "items-end justify-center pb-20",
  left: "items-center justify-start pl-20",
  right: "items-center justify-end pr-20",
};

// Animation variants
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

// Variant styles
const variantStyles = {
  default: {
    container: "",
    icon: null,
    iconBg: "",
  },
  alert: {
    container: "",
    icon: Info,
    iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  success: {
    container: "",
    icon: CheckCircle,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    container: "",
    icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  destructive: {
    container: "",
    icon: AlertCircle,
    iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
};

export function Modal(props: ModalProps) {
  const validatedProps = modalPropsSchema.parse(props);

  const {
    title,
    description,
    content,
    size = "md",
    position = "center",
    showHeader = true,
    showCloseButton = true,
    headerIcon,
    showFooter = true,
    primaryAction,
    secondaryAction,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    variant = "default",
    showOverlay = true,
    overlayBlur = true,
    animation = "scale",
    isOpen = true,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const variantConfig = variantStyles[variant];
  const anim = animationVariants[animation];
  const HeaderIcon = headerIcon ? getIcon(headerIcon) : variantConfig.icon;

  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Modal closed via Escape");
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={cn(
          "fixed inset-0 z-50 flex",
          positionClasses[position]
        )}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        data-testid={dataTestId}
      >
        {/* Overlay */}
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? () => console.log("Modal closed") : undefined}
            className={cn(
              "absolute inset-0 bg-black/50",
              overlayBlur && "backdrop-blur-sm"
            )}
          />
        )}

        {/* Modal */}
        <motion.div
          {...anim}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl",
            sizeClasses[size],
            variantConfig.container,
            className
          )}
        >
          {/* Header */}
          {showHeader && (
            <div className="flex items-start gap-4 p-6 pb-0">
              {/* Icon */}
              {HeaderIcon && (
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    variantConfig.iconBg
                  )}
                >
                  <HeaderIcon className="w-5 h-5" />
                </div>
              )}

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>

              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={() => console.log("Modal closed")}
                  className="flex-shrink-0 p-2 -m-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          {content && (
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-300">{content}</p>
            </div>
          )}

          {/* Footer */}
          {showFooter && (primaryAction || secondaryAction) && (
            <div className="flex items-center justify-end gap-3 p-6 pt-0">
              {secondaryAction && (
                <button
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    secondaryAction.variant === "ghost"
                      ? "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {secondaryAction.text}
                </button>
              )}
              {primaryAction && (
                <button
                  disabled={primaryAction.loading || primaryAction.disabled}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    primaryAction.variant === "destructive"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : primaryAction.variant === "outline"
                      ? "border border-violet-500 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  )}
                >
                  {primaryAction.loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    primaryAction.text
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

Modal.displayName = "Modal";
