"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonProps, buttonPropsSchema } from "@/schemas/button.schema";
import * as LucideIcons from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Button Component
 * ================
 * A versatile button component supporting multiple variants, sizes, states, and icons.
 * AI can render this with validated props from the schema.
 */

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        solid: "",
        outline: "bg-transparent border-2",
        ghost: "bg-transparent hover:bg-opacity-10",
        link: "bg-transparent underline-offset-4 hover:underline p-0 h-auto",
        soft: "bg-opacity-15 hover:bg-opacity-25",
      },
      color: {
        primary:
          "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-violet-600 data-[variant=solid]:to-purple-600 data-[variant=solid]:text-white data-[variant=solid]:hover:from-violet-700 data-[variant=solid]:hover:to-purple-700 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-violet-500/25 data-[variant=outline]:border-violet-500 data-[variant=outline]:text-violet-600 data-[variant=outline]:hover:bg-violet-50 data-[variant=ghost]:text-violet-600 data-[variant=ghost]:hover:bg-violet-100 data-[variant=link]:text-violet-600 data-[variant=soft]:bg-violet-500 data-[variant=soft]:text-violet-700 focus-visible:ring-violet-500",
        secondary:
          "data-[variant=solid]:bg-slate-700 data-[variant=solid]:text-white data-[variant=solid]:hover:bg-slate-800 data-[variant=outline]:border-slate-400 data-[variant=outline]:text-slate-600 data-[variant=outline]:hover:bg-slate-50 data-[variant=ghost]:text-slate-600 data-[variant=ghost]:hover:bg-slate-100 data-[variant=link]:text-slate-600 data-[variant=soft]:bg-slate-400 data-[variant=soft]:text-slate-700 focus-visible:ring-slate-500",
        accent:
          "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-cyan-500 data-[variant=solid]:to-teal-500 data-[variant=solid]:text-white data-[variant=solid]:hover:from-cyan-600 data-[variant=solid]:hover:to-teal-600 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-cyan-500/25 data-[variant=outline]:border-cyan-500 data-[variant=outline]:text-cyan-600 data-[variant=outline]:hover:bg-cyan-50 data-[variant=ghost]:text-cyan-600 data-[variant=ghost]:hover:bg-cyan-100 data-[variant=link]:text-cyan-600 data-[variant=soft]:bg-cyan-500 data-[variant=soft]:text-cyan-700 focus-visible:ring-cyan-500",
        destructive:
          "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-red-500 data-[variant=solid]:to-rose-500 data-[variant=solid]:text-white data-[variant=solid]:hover:from-red-600 data-[variant=solid]:hover:to-rose-600 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-red-500/25 data-[variant=outline]:border-red-500 data-[variant=outline]:text-red-600 data-[variant=outline]:hover:bg-red-50 data-[variant=ghost]:text-red-600 data-[variant=ghost]:hover:bg-red-100 data-[variant=link]:text-red-600 data-[variant=soft]:bg-red-500 data-[variant=soft]:text-red-700 focus-visible:ring-red-500",
        success:
          "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-emerald-500 data-[variant=solid]:to-green-500 data-[variant=solid]:text-white data-[variant=solid]:hover:from-emerald-600 data-[variant=solid]:hover:to-green-600 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-emerald-500/25 data-[variant=outline]:border-emerald-500 data-[variant=outline]:text-emerald-600 data-[variant=outline]:hover:bg-emerald-50 data-[variant=ghost]:text-emerald-600 data-[variant=ghost]:hover:bg-emerald-100 data-[variant=link]:text-emerald-600 data-[variant=soft]:bg-emerald-500 data-[variant=soft]:text-emerald-700 focus-visible:ring-emerald-500",
        warning:
          "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-amber-500 data-[variant=solid]:to-orange-500 data-[variant=solid]:text-white data-[variant=solid]:hover:from-amber-600 data-[variant=solid]:hover:to-orange-600 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-amber-500/25 data-[variant=outline]:border-amber-500 data-[variant=outline]:text-amber-600 data-[variant=outline]:hover:bg-amber-50 data-[variant=ghost]:text-amber-600 data-[variant=ghost]:hover:bg-amber-100 data-[variant=link]:text-amber-600 data-[variant=soft]:bg-amber-500 data-[variant=soft]:text-amber-700 focus-visible:ring-amber-500",
        info: "data-[variant=solid]:bg-gradient-to-r data-[variant=solid]:from-blue-500 data-[variant=solid]:to-indigo-500 data-[variant=solid]:text-white data-[variant=solid]:hover:from-blue-600 data-[variant=solid]:hover:to-indigo-600 data-[variant=solid]:shadow-lg data-[variant=solid]:shadow-blue-500/25 data-[variant=outline]:border-blue-500 data-[variant=outline]:text-blue-600 data-[variant=outline]:hover:bg-blue-50 data-[variant=ghost]:text-blue-600 data-[variant=ghost]:hover:bg-blue-100 data-[variant=link]:text-blue-600 data-[variant=soft]:bg-blue-500 data-[variant=soft]:text-blue-700 focus-visible:ring-blue-500",
        muted:
          "data-[variant=solid]:bg-slate-200 data-[variant=solid]:text-slate-700 data-[variant=solid]:hover:bg-slate-300 data-[variant=outline]:border-slate-300 data-[variant=outline]:text-slate-500 data-[variant=outline]:hover:bg-slate-50 data-[variant=ghost]:text-slate-500 data-[variant=ghost]:hover:bg-slate-100 data-[variant=link]:text-slate-500 data-[variant=soft]:bg-slate-300 data-[variant=soft]:text-slate-600 focus-visible:ring-slate-400",
        ghost:
          "data-[variant=solid]:bg-transparent data-[variant=solid]:text-slate-600 data-[variant=solid]:hover:bg-slate-100 data-[variant=outline]:border-transparent data-[variant=outline]:text-slate-600 data-[variant=outline]:hover:bg-slate-100 data-[variant=ghost]:text-slate-600 data-[variant=ghost]:hover:bg-slate-100 data-[variant=link]:text-slate-600 data-[variant=soft]:bg-slate-100 data-[variant=soft]:text-slate-600 focus-visible:ring-slate-400",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-11 px-6 text-base rounded-lg",
        xl: "h-12 px-8 text-lg rounded-xl",
        "2xl": "h-14 px-10 text-xl rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      color: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// Icon size mapping
const iconSizes: Record<string, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
};

// Get Lucide icon by name
function getIcon(name: string | undefined): React.ElementType | null {
  if (!name) return null;
  
  // Convert kebab-case to PascalCase
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  
  return ((LucideIcons as any) as Record<string, React.ElementType>)[pascalName] || null;
}

export function Button(props: ButtonProps) {
  // Parse and validate props
  const validatedProps = buttonPropsSchema.parse(props);
  
  const {
    text,
    variant = "solid",
    color = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    iconOnly = false,
    disabled = false,
    loading = false,
    fullWidth = false,
    ariaLabel,
    href,
    openInNewTab = false,
    className,
    id,
    "aria-label": ariaLabelProp,
    "data-testid": dataTestId,
  } = validatedProps;

  const iconSize = iconSizes[size] || 16;
  const LeftIconComponent = getIcon(leftIcon);
  const RightIconComponent = getIcon(rightIcon);

  const buttonContent = (
    <>
      {loading ? (
        <Loader2 className="animate-spin" size={iconSize} />
      ) : (
        LeftIconComponent && <LeftIconComponent size={iconSize} />
      )}
      {!iconOnly && <span>{text}</span>}
      {!loading && RightIconComponent && <RightIconComponent size={iconSize} />}
    </>
  );

  const commonProps = {
    className: cn(buttonVariants({ variant, color, size, fullWidth }), className),
    "data-variant": variant,
    disabled: disabled || loading,
    "aria-label": ariaLabel || ariaLabelProp || (iconOnly ? text : undefined),
    "data-testid": dataTestId,
    id,
  };

  // Render as link if href is provided
  if (href) {
    return (
      <motion.a
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...commonProps}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...commonProps}
    >
      {buttonContent}
    </motion.button>
  );
}

Button.displayName = "Button";
