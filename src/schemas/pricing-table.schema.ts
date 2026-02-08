import { z } from "zod";
import { iconNameSchema, basePropsSchema } from "./common.schema";

/**
 * Pricing Table Schema
 * ====================
 * Defines props for SaaS-style pricing tables with multiple tiers.
 */

// Individual feature in a pricing tier
export const pricingFeatureSchema = z.object({
    text: z.string().describe("Feature description text"),
    included: z.boolean().describe("Whether this feature is included in the tier"),
    tooltip: z.string().optional().describe("Additional info shown on hover"),
    highlight: z.boolean().optional().describe("Whether to highlight this feature"),
});

// Individual pricing tier
export const pricingTierSchema = z.object({
    id: z.string().describe("Unique identifier for the tier"),
    name: z.string().describe("Tier name (e.g., 'Starter', 'Pro', 'Enterprise')"),
    description: z.string().optional().describe("Short tier description"),

    // Pricing
    price: z.number().describe("Price amount"),
    currency: z.string().default("USD").describe("Currency code"),
    billingPeriod: z.enum(["monthly", "yearly", "one-time", "custom"])
        .describe("Billing frequency"),
    originalPrice: z.number().optional().describe("Original price for showing discounts"),

    // Visual
    featured: z.boolean().optional().default(false)
        .describe("Whether this is the recommended/featured tier"),
    badge: z.string().optional().describe("Badge text (e.g., 'Most Popular', 'Best Value')"),
    icon: iconNameSchema.optional().describe("Icon for the tier"),
    accentColor: z.string().optional().describe("Custom accent color for this tier"),

    // Features
    features: z.array(pricingFeatureSchema)
        .describe("List of features for this tier"),

    // CTA
    ctaText: z.string().default("Get Started").describe("Call-to-action button text"),
    ctaVariant: z.enum(["solid", "outline", "ghost"]).optional().default("solid"),
});

export const pricingTablePropsSchema = basePropsSchema.extend({
    // Content
    headline: z.string().optional().describe("Main headline above pricing tiers"),
    subheadline: z.string().optional().describe("Supporting text below headline"),

    // Tiers
    tiers: z.array(pricingTierSchema)
        .min(1)
        .max(5)
        .describe("Pricing tiers to display (1-5 tiers)"),

    // Layout
    layout: z.enum(["horizontal", "comparison"])
        .optional()
        .default("horizontal")
        .describe("horizontal shows tiers side-by-side, comparison shows feature comparison table"),

    // Billing Toggle
    showBillingToggle: z.boolean()
        .optional()
        .default(false)
        .describe("Whether to show monthly/yearly toggle"),

    yearlyDiscount: z.number()
        .optional()
        .describe("Percentage discount for yearly billing (0-100)"),

    defaultBilling: z.enum(["monthly", "yearly"])
        .optional()
        .default("monthly"),

    // Style
    compact: z.boolean()
        .optional()
        .default(false)
        .describe("Use compact layout for smaller spaces"),

    // Comparisons
    showFeatureComparison: z.boolean()
        .optional()
        .default(true)
        .describe("Whether to show feature checkmarks/x marks"),

    // FAQ
    faqItems: z.array(z.object({
        question: z.string(),
        answer: z.string(),
    })).optional().describe("Optional FAQ items to display below pricing"),
});

export type PricingFeature = z.infer<typeof pricingFeatureSchema>;
export type PricingTier = z.infer<typeof pricingTierSchema>;
export type PricingTableProps = z.infer<typeof pricingTablePropsSchema>;
