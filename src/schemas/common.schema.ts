import { z } from "zod";

/**
 * Common Schemas
 * ==============
 * Reusable schema definitions for component props.
 */

// Color palette options available in the design system
export const colorSchema = z.enum([
    "primary",
    "secondary",
    "accent",
    "destructive",
    "success",
    "warning",
    "info",
    "muted",
    "ghost",
]);

// Size variants for components
export const sizeSchema = z.enum(["xs", "sm", "md", "lg", "xl", "2xl"]);

// Spacing variants
export const spacingSchema = z.enum(["none", "xs", "sm", "md", "lg", "xl"]);

// Icon names available in the system (using Lucide icons)
export const iconNameSchema = z.enum([
    "check",
    "x",
    "plus",
    "minus",
    "arrow-right",
    "arrow-left",
    "arrow-up",
    "arrow-down",
    "chevron-right",
    "chevron-left",
    "chevron-up",
    "chevron-down",
    "star",
    "heart",
    "home",
    "settings",
    "user",
    "users",
    "mail",
    "phone",
    "calendar",
    "clock",
    "search",
    "filter",
    "menu",
    "bell",
    "bookmark",
    "download",
    "upload",
    "share",
    "edit",
    "trash",
    "copy",
    "save",
    "refresh",
    "external-link",
    "link",
    "image",
    "video",
    "file",
    "folder",
    "database",
    "server",
    "cloud",
    "shield",
    "lock",
    "unlock",
    "key",
    "eye",
    "eye-off",
    "globe",
    "map-pin",
    "credit-card",
    "dollar-sign",
    "trending-up",
    "trending-down",
    "bar-chart",
    "pie-chart",
    "activity",
    "zap",
    "sparkles",
    "rocket",
    "gift",
    "award",
    "target",
    "flag",
    "help-circle",
    "info",
    "alert-circle",
    "alert-triangle",
    "check-circle",
    "x-circle",
    "loader",
    "layout-dashboard",
    "layout-grid",
    "list",
    "table",
    "columns",
    "layers",
    "box",
    "package",
]);

// Typography variants
export const textAlignSchema = z.enum(["left", "center", "right", "justify"]);

// Border radius
export const radiusSchema = z.enum(["none", "sm", "md", "lg", "xl", "full"]);

// Shadow variants
export const shadowSchema = z.enum([
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "inner",
]);

// Animation presets
export const animationSchema = z.enum([
    "none",
    "fade-in",
    "slide-up",
    "slide-down",
    "slide-left",
    "slide-right",
    "scale-in",
    "bounce",
    "pulse",
]);

// Breakpoint for responsive design
export const breakpointSchema = z.enum(["sm", "md", "lg", "xl", "2xl"]);

// Common base props that most components share
export const basePropsSchema = z.object({
    id: z.string().optional().describe("Unique identifier for the component"),
    className: z.string().optional().describe("Additional CSS classes"),
    "aria-label": z.string().optional().describe("Accessibility label"),
    "data-testid": z.string().optional().describe("Test identifier"),
});

// Types derived from schemas
export type Color = z.infer<typeof colorSchema>;
export type Size = z.infer<typeof sizeSchema>;
export type Spacing = z.infer<typeof spacingSchema>;
export type IconName = z.infer<typeof iconNameSchema>;
export type TextAlign = z.infer<typeof textAlignSchema>;
export type Radius = z.infer<typeof radiusSchema>;
export type Shadow = z.infer<typeof shadowSchema>;
export type Animation = z.infer<typeof animationSchema>;
export type Breakpoint = z.infer<typeof breakpointSchema>;
