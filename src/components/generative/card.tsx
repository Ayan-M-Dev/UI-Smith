"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type CardProps, cardPropsSchema } from "@/schemas/card.schema";
import { motion } from "framer-motion";

/**
 * Card Component
 * ==============
 * A versatile container component for grouped content.
 * Supports various visual styles, header/footer sections, and images.
 */

// Variant-specific styles
const variantStyles = {
  elevated:
    "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50",
  outlined:
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
  filled:
    "bg-slate-50 dark:bg-slate-800",
  glass:
    "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-200/30 dark:shadow-slate-900/30",
  gradient:
    "bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-200/50 dark:border-violet-700/30",
};

// Radius styles
const radiusStyles = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-3xl",
};

// Padding styles
const paddingStyles = {
  none: "p-0",
  xs: "p-2",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

// Shadow styles (for elevated variant)
const shadowStyles = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
};

export function Card(props: CardProps) {
  // Parse and validate props
  const validatedProps = cardPropsSchema.parse(props);

  const {
    variant = "elevated",
    shadow,
    radius = "lg",
    padding = "md",
    fullWidth = false,
    hasHeader = false,
    headerTitle,
    headerSubtitle,
    headerAction,
    content,
    imageUrl,
    imagePosition = "top",
    imageAlt = "",
    hasFooter = false,
    footerContent,
    hoverable = false,
    clickable = false,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const cardClasses = cn(
    // Base styles
    "relative overflow-hidden transition-all duration-300",
    // Variant
    variantStyles[variant],
    // Radius
    radiusStyles[radius],
    // Additional shadow for elevated
    variant === "elevated" && shadow && shadowStyles[shadow],
    // Width
    fullWidth ? "w-full" : "",
    // Hover effects
    hoverable && "hover:shadow-2xl hover:-translate-y-1",
    clickable && "cursor-pointer active:scale-[0.99]",
    className
  );

  // Render header section
  const renderHeader = () => {
    if (!hasHeader && !headerTitle) return null;

    return (
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1 min-w-0">
          {headerTitle && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {headerTitle}
            </h3>
          )}
          {headerSubtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {headerSubtitle}
            </p>
          )}
        </div>
        {headerAction && (
          <div className="shrink-0">
            {headerAction.variant === "link" ? (
              <a
                href="#"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
              >
                {headerAction.text}
              </a>
            ) : headerAction.variant === "button" ? (
              <button className="px-3 py-1.5 text-sm font-medium bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400">
                {headerAction.text}
              </button>
            ) : (
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render image
  const renderImage = () => {
    if (!imageUrl) return null;

    const imageClasses = cn(
      "object-cover",
      imagePosition === "top" && "w-full h-48 -mt-5 -mx-5 mb-5 first:mt-0",
      imagePosition === "background" && "absolute inset-0 w-full h-full"
    );

    return (
      <div className={imagePosition === "background" ? "absolute inset-0" : ""}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className={imageClasses}
        />
        {imagePosition === "background" && (
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        )}
      </div>
    );
  };

  // Render content
  const renderContent = () => {
    if (!content) return null;

    return (
      <div
        className={cn(
          "text-slate-600 dark:text-slate-300",
          imagePosition === "background" && "relative z-10 text-white"
        )}
      >
        {content}
      </div>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!hasFooter && !footerContent) return null;

    return (
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {footerContent}
        </p>
      </div>
    );
  };

  // Handle left/right image positions
  if (imageUrl && (imagePosition === "left" || imagePosition === "right")) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(cardClasses, "flex", "p-0")}
        id={id}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
      >
        {imagePosition === "left" && (
          <div className="shrink-0 w-1/3">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={cn("flex-1", paddingStyles[padding])}>
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </div>
        {imagePosition === "right" && (
          <div className="shrink-0 w-1/3">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        cardClasses,
        paddingStyles[padding],
        imagePosition === "background" && "min-h-[200px] flex flex-col justify-end"
      )}
      id={id}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {imagePosition === "background" && renderImage()}
      {imagePosition === "top" && renderImage()}
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </motion.div>
  );
}

Card.displayName = "Card";
