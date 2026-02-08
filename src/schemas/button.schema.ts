import { z } from "zod";
import { colorSchema, sizeSchema, iconNameSchema, basePropsSchema } from "./common.schema";

/**
 * Button Schema
 * =============
 * Defines all valid props for the Button component.
 * The AI can ONLY use these props when rendering buttons.
 */

export const buttonVariantSchema = z.enum([
    "solid",
    "outline",
    "ghost",
    "link",
    "soft",
]);

export const buttonPropsSchema = basePropsSchema.extend({
    // Content
    text: z.string().describe("The button label text"),

    // Visual variants
    variant: buttonVariantSchema
        .optional()
        .default("solid")
        .describe("Visual style variant: solid (filled), outline (bordered), ghost (transparent), link (text only), soft (subtle background)"),

    color: colorSchema
        .optional()
        .default("primary")
        .describe("Color theme from the design system palette"),

    size: sizeSchema
        .optional()
        .default("md")
        .describe("Button size: xs, sm, md, lg, xl, 2xl"),

    // Icons
    leftIcon: iconNameSchema
        .optional()
        .describe("Icon to display on the left side of the text"),

    rightIcon: iconNameSchema
        .optional()
        .describe("Icon to display on the right side of the text"),

    iconOnly: z.boolean()
        .optional()
        .default(false)
        .describe("If true, only shows icon without text (requires leftIcon or rightIcon)"),

    // States
    disabled: z.boolean()
        .optional()
        .default(false)
        .describe("Whether the button is disabled and non-interactive"),

    loading: z.boolean()
        .optional()
        .default(false)
        .describe("Shows loading spinner and disables interaction"),

    // Layout
    fullWidth: z.boolean()
        .optional()
        .default(false)
        .describe("Whether button should span full container width"),

    // Accessibility
    ariaLabel: z.string()
        .optional()
        .describe("Accessible label for screen readers (required for iconOnly buttons)"),

    // Actions (for demonstration - in real app would connect to handlers)
    href: z.string()
        .optional()
        .describe("URL to navigate to (renders as link)"),

    openInNewTab: z.boolean()
        .optional()
        .default(false)
        .describe("Whether to open href in new tab"),
});

export type ButtonProps = z.infer<typeof buttonPropsSchema>;
export type ButtonVariant = z.infer<typeof buttonVariantSchema>;
