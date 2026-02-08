import { z } from "zod";
import { basePropsSchema } from "./common.schema";

/**
 * Testimonial Section Schema
 * ==========================
 * Defines props for testimonial/review sections with various layouts.
 */

// Individual testimonial
export const testimonialSchema = z.object({
    id: z.string(),
    quote: z.string().describe("The testimonial text/quote"),

    // Author info
    authorName: z.string().describe("Name of the person giving testimonial"),
    authorRole: z.string().optional().describe("Role/title of the author"),
    authorCompany: z.string().optional().describe("Company of the author"),
    authorAvatarUrl: z.string().optional().describe("URL to author's avatar image"),

    // Rating
    rating: z.number().min(1).max(5).optional().describe("Star rating (1-5)"),

    // Media
    logoUrl: z.string().optional().describe("Company logo URL"),
    imageUrl: z.string().optional().describe("Featured image for the testimonial"),
    videoUrl: z.string().optional().describe("Video testimonial URL"),

    // Meta
    date: z.string().optional().describe("Date of the testimonial"),
    featured: z.boolean().optional().default(false).describe("Whether this is a featured testimonial"),

    // Source
    source: z.string().optional().describe("Where the testimonial came from (e.g., 'G2', 'Trustpilot')"),
    sourceUrl: z.string().optional().describe("Link to the original review"),
});

export const testimonialSectionPropsSchema = basePropsSchema.extend({
    // Heading
    headline: z.string().optional().describe("Section headline"),
    subheadline: z.string().optional().describe("Section subheadline"),

    // Testimonials
    testimonials: z.array(testimonialSchema)
        .min(1)
        .describe("Array of testimonials to display"),

    // Layout
    layout: z.enum([
        "grid",      // Grid of cards
        "carousel",  // Sliding carousel
        "masonry",   // Masonry/Pinterest style
        "featured",  // One large featured + smaller ones
        "stack",     // Stacked cards
        "quotes",    // Large quote display
    ]).optional().default("grid"),

    columns: z.number().min(1).max(4).optional().default(3)
        .describe("Number of columns for grid layout"),

    // Display options
    showRatings: z.boolean().optional().default(true),
    showAvatars: z.boolean().optional().default(true),
    showCompanyLogos: z.boolean().optional().default(false),
    showDates: z.boolean().optional().default(false),

    // Carousel options
    autoplay: z.boolean().optional().default(false),
    autoplayInterval: z.number().optional().default(5000).describe("Autoplay interval in ms"),
    showDots: z.boolean().optional().default(true),
    showArrows: z.boolean().optional().default(true),

    // Style
    cardStyle: z.enum([
        "elevated",
        "outlined",
        "minimal",
        "gradient",
    ]).optional().default("elevated"),

    // Quote style
    showQuoteMarks: z.boolean().optional().default(true),
    quoteMarkStyle: z.enum(["classic", "modern", "minimal"]).optional().default("modern"),

    // Animation
    animateOnScroll: z.boolean().optional().default(true),
    staggerAnimation: z.boolean().optional().default(true),

    // Stats (for social proof)
    showStats: z.boolean().optional().default(false),
    stats: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })).optional().describe("Stats to display (e.g., '1000+ reviews', '4.9 average')"),

    // CTA
    showCta: z.boolean().optional().default(false),
    ctaText: z.string().optional().default("See all reviews"),
    ctaHref: z.string().optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialSectionProps = z.infer<typeof testimonialSectionPropsSchema>;
