// import { type TamboComponent } from "@tambo-ai/react";

import { Button } from "@/components/generative/button";
import { Card } from "@/components/generative/card";
import { PricingTable } from "@/components/generative/pricing-table";
import { DashboardLayout } from "@/components/generative/dashboard-layout";
import { Chart } from "@/components/generative/chart";
import { Form } from "@/components/generative/form";
import { Modal } from "@/components/generative/modal";
import { TestimonialSection } from "@/components/generative/testimonial-section";

import { buttonPropsSchema } from "@/schemas/button.schema";
import { cardPropsSchema } from "@/schemas/card.schema";
import { pricingTablePropsSchema } from "@/schemas/pricing-table.schema";
import { dashboardLayoutPropsSchema } from "@/schemas/dashboard-layout.schema";
import { chartPropsSchema } from "@/schemas/chart.schema";
import { formPropsSchema } from "@/schemas/form.schema";
import { modalPropsSchema } from "@/schemas/modal.schema";
import { testimonialSectionPropsSchema } from "@/schemas/testimonial-section.schema";

/**
 * Tambo Component Registry
 * ========================
 * This registry defines all components available to the AI for rendering.
 * Each component has:
 * - name: Unique identifier for the component
 * - description: Detailed description helping the AI understand when to use it
 * - component: The React component to render
 * - propsSchema: Zod schema defining valid props (prevents hallucination)
 */

export const tamboComponents: any[] = [
    {
        name: "Button",
        description: `A versatile button component for user interactions and calls-to-action.
    
    Use this component when you need:
    - Call-to-action buttons (e.g., "Get Started", "Learn More", "Sign Up")
    - Form submit buttons
    - Navigation links styled as buttons
    - Icon-only action buttons
    
    Variants available:
    - solid: Filled background with gradient, best for primary CTAs
    - outline: Border only, good for secondary actions
    - ghost: Transparent until hover, for tertiary actions
    - link: Text only with underline on hover
    - soft: Subtle background, gentle appearance
    
    Colors: primary (violet/purple), secondary (slate), accent (cyan/teal), destructive (red), success (emerald), warning (amber), info (blue), muted (gray), ghost (transparent)
    
    Sizes: xs, sm, md (default), lg, xl, 2xl
    
    Icons can be added on left or right side using Lucide icon names.`,
        component: Button,
        propsSchema: buttonPropsSchema,
    },
    {
        name: "Card",
        description: `A container component for grouping related content with various visual styles.
    
    Use this component when you need:
    - Content containers with visual separation
    - Feature showcases
    - Product displays
    - Information cards
    - Image + text layouts
    
    Variants available:
    - elevated: Box shadow for depth (default)
    - outlined: Border for subtle separation
    - filled: Background color without shadow
    - glass: Glassmorphism effect with blur
    - gradient: Subtle gradient background
    
    Features:
    - Optional header with title, subtitle, and action
    - Optional footer section
    - Image support (top, left, right, or background position)
    - Hoverable and clickable states
    - Configurable padding and border radius`,
        component: Card,
        propsSchema: cardPropsSchema,
    },
    {
        name: "PricingTable",
        description: `A SaaS-style pricing table for displaying subscription tiers and features.
    
    Use this component when you need:
    - Pricing page for SaaS products
    - Subscription tier comparison
    - Feature comparison across plans
    - Product pricing display
    
    Features:
    - 1-5 pricing tiers
    - Monthly/yearly billing toggle with discount
    - Feature lists with included/excluded states
    - Featured/recommended tier highlighting
    - Badges (e.g., "Most Popular", "Best Value")
    - Optional FAQ section
    
    Each tier includes:
    - Name and description
    - Price with currency and billing period
    - Feature list with checkmarks
    - CTA button with customizable text
    - Optional badge and icon
    
    Layout options: horizontal (side-by-side) or comparison (table format)`,
        component: PricingTable,
        propsSchema: pricingTablePropsSchema,
    },
    {
        name: "DashboardLayout",
        description: `A comprehensive dashboard layout with sidebar navigation and header.
    
    Use this component when you need:
    - Admin dashboard structure
    - Application shell with navigation
    - Multi-page app layout
    - Settings pages
    - User portals
    
    Features:
    - Collapsible sidebar with nested navigation
    - Navigation items with icons, badges, and children
    - Header with breadcrumbs, search, notifications
    - User profile section in sidebar
    - Responsive design with mobile menu
    - Theme support (light/dark/system)
    
    Layout options:
    - sidebar-header: Full dashboard with both
    - header-only: Just header + content
    - sidebar-only: Just sidebar + content
    - minimal: Plain content area
    
    Sidebar features:
    - Logo/brand area
    - Navigation items with nested children
    - User profile section
    - Footer content`,
        component: DashboardLayout,
        propsSchema: dashboardLayoutPropsSchema,
    },
    {
        name: "Chart",
        description: `A data visualization component supporting multiple chart types.
    
    Use this component when you need:
    - Data visualizations
    - Analytics dashboards
    - Trend displays
    - Comparisons and distributions
    - KPI representations
    
    Chart types:
    - line: Trend lines over time
    - bar: Categorical comparisons
    - area: Volume over time
    - pie: Part-to-whole relationships
    - donut: Pie with center cutout
    - scatter: Correlation plots
    - composed: Mixed chart types
    
    Features:
    - Multiple data series support
    - Color schemes: default, warm, cool, monochrome, vibrant, pastel
    - Custom colors array
    - Grid, axes, legend configuration
    - Stacked bars/areas
    - Reference lines for thresholds
    - Tooltips and interactivity
    - Title and subtitle
    
    Data format: Array of objects with 'name' and 'value' properties.`,
        component: Chart,
        propsSchema: chartPropsSchema,
    },
    {
        name: "Form",
        description: `A dynamic form component with various field types and validation.
    
    Use this component when you need:
    - Contact forms
    - Sign-up/login forms
    - Settings forms
    - Multi-step wizards
    - Survey forms
    - Data entry
    
    Field types:
    - text, email, password, number, tel, url
    - textarea (multi-line text)
    - select, multiselect (dropdowns)
    - checkbox, radio, switch (boolean/choice)
    - date, time, datetime
    - file, color, range
    
    Features:
    - Sections for organizing fields
    - Validation rules (required, email, minLength, maxLength, etc.)
    - Conditional field visibility
    - Icons in inputs
    - Help text and error messages
    - Progress indicator for multi-step
    - Submit and cancel buttons
    
    Layout: vertical, horizontal, or inline
    Label positions: top, left, or floating`,
        component: Form,
        propsSchema: formPropsSchema,
    },
    {
        name: "Modal",
        description: `A modal dialog component for overlays and confirmations.
    
    Use this component when you need:
    - Confirmation dialogs
    - Alert messages
    - Form popups
    - Detail views
    - Notifications requiring action
    
    Variants:
    - default: Standard modal
    - alert: With info icon
    - success: With checkmark
    - warning: With warning icon
    - destructive: With error icon
    
    Features:
    - Configurable size (sm, md, lg, xl, full)
    - Position (center, top, bottom, left, right)
    - Header with title, description, optional icon
    - Close button
    - Footer with primary/secondary actions
    - Animation options (fade, scale, slide)
    - Overlay with optional blur
    - Close on overlay click or escape key`,
        component: Modal,
        propsSchema: modalPropsSchema,
    },
    {
        name: "TestimonialSection",
        description: `A section for displaying customer testimonials and reviews.
    
    Use this component when you need:
    - Customer testimonials
    - Product reviews
    - Social proof sections
    - Case study quotes
    - User feedback display
    
    Layout options:
    - grid: Cards in a grid (1-4 columns)
    - carousel: Sliding carousel with navigation
    - featured: One large + smaller cards
    - quotes: Large centered quote format
    - masonry: Pinterest-style layout
    - stack: Stacked cards
    
    Features:
    - Star ratings (1-5)
    - Author info (name, role, company, avatar)
    - Company logos
    - Quote marks (classic, modern, minimal)
    - Date and source information
    - Carousel with autoplay
    - Stats section (e.g., "1000+ reviews")
    - CTA to see all reviews
    
    Card styles: elevated, outlined, minimal, gradient`,
        component: TestimonialSection,
        propsSchema: testimonialSectionPropsSchema,
    },
];

/**
 * TamboComponentRegistry
 * ======================
 * Utility class for component management and lookup.
 */
export class TamboComponentRegistry {
    private components: Map<string, any>;

    constructor(componentList: any[]) {
        this.components = new Map();
        componentList.forEach((comp) => {
            this.components.set(comp.name, comp);
        });
    }

    /**
     * Get a component by name
     */
    get(name: string): any | undefined {
        return this.components.get(name);
    }

    /**
     * Check if a component exists
     */
    has(name: string): boolean {
        return this.components.has(name);
    }

    /**
     * Get all component names
     */
    getNames(): string[] {
        return Array.from(this.components.keys());
    }

    /**
     * Get all components as array
     */
    getAll(): any[] {
        return Array.from(this.components.values());
    }

    /**
     * Get component descriptions for AI context
     */
    getDescriptions(): Record<string, string> {
        const descriptions: Record<string, string> = {};
        this.components.forEach((comp, name) => {
            descriptions[name] = comp.description;
        });
        return descriptions;
    }
}

// Export singleton registry
export const componentRegistry = new TamboComponentRegistry(tamboComponents);
