import { z } from "zod";
import { shadowSchema, radiusSchema, spacingSchema, basePropsSchema } from "./common.schema";

/**
 * Card Schema
 * ===========
 * Defines all valid props for the Card component.
 * Cards are versatile containers for grouped content.
 */

export const cardVariantSchema = z.enum([
    "elevated",   // With shadow
    "outlined",   // With border
    "filled",     // Background color, no shadow
    "glass",      // Glassmorphism effect
    "gradient",   // Gradient background
]);

export const cardPropsSchema = basePropsSchema.extend({
    // Visual
    variant: cardVariantSchema
        .optional()
        .default("elevated")
        .describe("Card visual style"),

    shadow: shadowSchema
        .optional()
        .describe("Shadow depth (only for elevated variant)"),

    radius: radiusSchema
        .optional()
        .default("lg")
        .describe("Border radius"),

    padding: spacingSchema
        .optional()
        .default("md")
        .describe("Internal padding"),

    // Layout
    fullWidth: z.boolean()
        .optional()
        .default(false)
        .describe("Whether card should span full width"),

    // Header Section
    hasHeader: z.boolean()
        .optional()
        .default(false)
        .describe("Whether to show a header section"),

    headerTitle: z.string()
        .optional()
        .describe("Title text in the header"),

    headerSubtitle: z.string()
        .optional()
        .describe("Subtitle text below the header title"),

    headerAction: z.object({
        text: z.string(),
        variant: z.enum(["button", "link", "icon"]),
    }).optional().describe("Action element in the header"),

    // Content
    content: z.string()
        .optional()
        .describe("Main text content of the card"),

    // Media
    imageUrl: z.string()
        .optional()
        .describe("URL for header/cover image"),

    imagePosition: z.enum(["top", "left", "right", "background"])
        .optional()
        .default("top")
        .describe("Position of the image relative to content"),

    imageAlt: z.string()
        .optional()
        .describe("Alt text for the image"),

    // Footer Section
    hasFooter: z.boolean()
        .optional()
        .default(false)
        .describe("Whether to show a footer section"),

    footerContent: z.string()
        .optional()
        .describe("Text content in the footer"),

    // Interactive
    hoverable: z.boolean()
        .optional()
        .default(false)
        .describe("Whether card has hover effect"),

    clickable: z.boolean()
        .optional()
        .default(false)
        .describe("Whether card is clickable (surface acts as button)"),
});

export type CardProps = z.infer<typeof cardPropsSchema>;
export type CardVariant = z.infer<typeof cardVariantSchema>;
