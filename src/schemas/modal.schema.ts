import { z } from "zod";
import { sizeSchema, iconNameSchema, basePropsSchema } from "./common.schema";

/**
 * Modal Schema
 * ============
 * Defines props for modal dialogs with various configurations.
 */

export const modalPropsSchema = basePropsSchema.extend({
    // Content
    title: z.string().describe("Modal title in the header"),
    description: z.string().optional().describe("Description text below the title"),
    content: z.string().optional().describe("Main body content of the modal"),

    // Size & Layout
    size: z.enum(["sm", "md", "lg", "xl", "full"])
        .optional()
        .default("md")
        .describe("Modal size"),

    position: z.enum(["center", "top", "bottom", "left", "right"])
        .optional()
        .default("center")
        .describe("Modal position on screen"),

    // Header
    showHeader: z.boolean().optional().default(true),
    showCloseButton: z.boolean().optional().default(true),
    headerIcon: iconNameSchema.optional().describe("Icon in the header"),

    // Footer & Actions
    showFooter: z.boolean().optional().default(true),

    primaryAction: z.object({
        text: z.string(),
        variant: z.enum(["solid", "outline", "destructive"]).optional().default("solid"),
        loading: z.boolean().optional(),
        disabled: z.boolean().optional(),
    }).optional().describe("Primary action button"),

    secondaryAction: z.object({
        text: z.string(),
        variant: z.enum(["solid", "outline", "ghost"]).optional().default("outline"),
    }).optional().describe("Secondary action button"),

    // Behavior
    closeOnOverlayClick: z.boolean().optional().default(true),
    closeOnEscape: z.boolean().optional().default(true),
    preventScroll: z.boolean().optional().default(true),

    // Visual
    variant: z.enum([
        "default",
        "alert",
        "success",
        "warning",
        "destructive",
    ]).optional().default("default").describe("Visual style variant"),

    showOverlay: z.boolean().optional().default(true),
    overlayBlur: z.boolean().optional().default(true),

    // Animation
    animation: z.enum([
        "fade",
        "scale",
        "slide-up",
        "slide-down",
        "none",
    ]).optional().default("scale"),

    // State (for demonstration)
    isOpen: z.boolean().optional().default(true),
});

// Alert Dialog specific (simpler modal for confirmations)
export const alertDialogPropsSchema = basePropsSchema.extend({
    title: z.string().describe("Alert title"),
    description: z.string().describe("Alert message"),

    variant: z.enum(["info", "success", "warning", "destructive"])
        .optional()
        .default("info"),

    icon: iconNameSchema.optional(),

    confirmText: z.string().optional().default("Confirm"),
    cancelText: z.string().optional().default("Cancel"),

    showCancel: z.boolean().optional().default(true),

    isOpen: z.boolean().optional().default(true),
});

export type ModalProps = z.infer<typeof modalPropsSchema>;
export type AlertDialogProps = z.infer<typeof alertDialogPropsSchema>;
