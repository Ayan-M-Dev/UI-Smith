/**
 * UI Architect Agent
 * ==================
 * Translates user intent into component trees.
 * 
 * Responsibilities:
 * - Parse natural language UI descriptions
 * - Select appropriate components from the registry
 * - Configure component props based on user requirements
 * - Create initial UI specification
 * 
 * Tools Access:
 * - Design System MCP: get_component_list, get_component_schema, validate_props
 * - UX Best Practices MCP: get_cta_recommendations, get_visual_hierarchy_tips
 */

import { AgentConfig, AgentResponse, UISpec, ComponentSpec, AgentContext } from "./types";
import { componentRegistry } from "@/tambo/component-registry";
import { v4 as uuidv4 } from "uuid";

export const uiArchitectConfig: AgentConfig = {
    name: "UI Architect",
    role: "ui-architect",
    systemPrompt: `You are the UI Architect agent for UI-Smith. Your role is to translate natural language descriptions into structured UI specifications using the available component library.

## Your Capabilities
- Understand user intent from natural language descriptions
- Select appropriate components from the UI-Smith registry
- Configure component props to match user requirements
- Create hierarchical component structures

## Available Components
${componentRegistry.getNames().map(name => {
        const comp = componentRegistry.get(name);
        return `- ${name}: ${comp?.description.split('\n')[0]}`;
    }).join('\n')}

## Guidelines
1. ONLY use components from the registry - never invent new ones
2. Always validate props against component schemas
3. Prefer composability - combine simple components for complex UIs
4. Consider responsive design - mobile-first approach
5. Think about visual hierarchy - important elements should stand out

## Output Format
Always output a valid UISpec in JSON format with:
- id: unique identifier
- name: descriptive name
- components: array of ComponentSpec objects

## Examples

User: "Create a pricing page"
Response: {
  "id": "uuid",
  "name": "Pricing Page",
  "components": [
    {
      "name": "PricingTable",
      "props": {
        "headline": "Simple, Transparent Pricing",
        "tiers": [...],
        "showBillingToggle": true
      }
    }
  ]
}

User: "Add a hero section with a call to action"
Response: {
  "id": "uuid",
  "name": "Hero Section",
  "components": [
    {
      "name": "Card",
      "props": {
        "variant": "gradient",
        "title": "Welcome to Our Product",
        "content": "Description here...",
        "size": "lg"
      }
    },
    {
      "name": "Button",
      "props": {
        "text": "Get Started",
        "variant": "solid",
        "size": "lg"
      }
    }
  ]
}
`,
    tools: [
        "design-system:get_component_list",
        "design-system:get_component_schema",
        "design-system:validate_props",
        "design-system:get_layout_rules",
        "ux:get_cta_recommendations",
        "ux:get_visual_hierarchy_tips",
    ],
    temperature: 0.7,
    maxTokens: 4000,
};

/**
 * UI Architect Agent Class
 */
export class UIArchitectAgent {
    private context: AgentContext;

    constructor(context: AgentContext) {
        this.context = context;
    }

    /**
     * Process a user request and generate UI specification
     */
    async processRequest(userMessage: string): Promise<AgentResponse> {
        try {
            // Analyze the request type
            const requestType = this.analyzeRequestType(userMessage);

            // Generate UI based on request type
            let uiSpec: UISpec;

            if (requestType === "create") {
                uiSpec = await this.createNewUI(userMessage);
            } else if (requestType === "modify") {
                if (!this.context.currentUI) {
                    return {
                        success: false,
                        errors: [{
                            code: "NO_EXISTING_UI",
                            message: "No existing UI to modify. Please create a UI first.",
                            severity: "error",
                        }],
                    };
                }
                uiSpec = await this.modifyExistingUI(userMessage, this.context.currentUI);
            } else {
                return {
                    success: false,
                    errors: [{
                        code: "UNKNOWN_REQUEST",
                        message: "Could not understand the request. Please describe what UI you want to create.",
                        severity: "error",
                    }],
                };
            }

            return {
                success: true,
                data: uiSpec,
                nextAgent: "design-critic",
            };
        } catch (error) {
            return {
                success: false,
                errors: [{
                    code: "PROCESSING_ERROR",
                    message: String(error),
                    severity: "error",
                }],
            };
        }
    }

    /**
     * Analyze whether the request is to create new UI or modify existing
     */
    private analyzeRequestType(message: string): "create" | "modify" | "unknown" {
        const lowerMessage = message.toLowerCase();

        // Keywords indicating modification
        const modifyKeywords = [
            "change", "update", "modify", "make it", "add to",
            "remove", "improve", "fix", "adjust", "tweak",
            "instead", "replace", "bigger", "smaller", "more",
        ];

        // Keywords indicating creation
        const createKeywords = [
            "create", "build", "make", "generate", "design",
            "new", "start", "begin", "i want", "i need",
        ];

        const hasModifyKeyword = modifyKeywords.some(k => lowerMessage.includes(k));
        const hasCreateKeyword = createKeywords.some(k => lowerMessage.includes(k));

        if (hasModifyKeyword && this.context.currentUI) {
            return "modify";
        }

        if (hasCreateKeyword || !this.context.currentUI) {
            return "create";
        }

        // Default to modify if we have existing UI
        return this.context.currentUI ? "modify" : "create";
    }

    /**
     * Create a new UI from user description
     */
    private async createNewUI(description: string): Promise<UISpec> {
        const keywords = this.extractKeywords(description);
        const components = this.selectComponents(keywords, description);

        return {
            id: uuidv4(),
            name: this.generateUIName(description),
            description: description,
            components,
            layout: this.determineLayout(components),
            metadata: {
                createdAt: new Date().toISOString(),
                version: 1,
            },
        };
    }

    /**
     * Modify existing UI based on user request
     */
    private async modifyExistingUI(request: string, currentUI: UISpec): Promise<UISpec> {
        const keywords = this.extractKeywords(request);
        const modifications = this.determineModifications(request, keywords);

        // Clone the current UI
        const newUI: UISpec = JSON.parse(JSON.stringify(currentUI));
        newUI.id = uuidv4();
        newUI.metadata = {
            ...newUI.metadata,
            updatedAt: new Date().toISOString(),
            version: (newUI.metadata?.version || 0) + 1,
        };

        // Apply modifications
        for (const mod of modifications) {
            switch (mod.action) {
                case "add":
                    if (mod.component) {
                        newUI.components.push(mod.component);
                    }
                    break;
                case "remove":
                    if (mod.componentIndex !== undefined) {
                        newUI.components.splice(mod.componentIndex, 1);
                    }
                    break;
                case "update":
                    if (mod.componentIndex !== undefined && mod.props) {
                        newUI.components[mod.componentIndex].props = {
                            ...newUI.components[mod.componentIndex].props,
                            ...mod.props,
                        };
                    }
                    break;
                case "replace":
                    if (mod.componentIndex !== undefined && mod.component) {
                        newUI.components[mod.componentIndex] = mod.component;
                    }
                    break;
            }
        }

        return newUI;
    }

    /**
     * Extract keywords from user description
     */
    private extractKeywords(description: string): string[] {
        const keywords: string[] = [];
        const lowerDesc = description.toLowerCase();

        // Component-related keywords
        const componentKeywords = {
            button: ["button", "cta", "action", "click", "submit"],
            card: ["card", "container", "box", "section", "panel"],
            pricing: ["pricing", "plans", "tiers", "subscription", "cost"],
            dashboard: ["dashboard", "admin", "panel", "analytics", "stats"],
            chart: ["chart", "graph", "data", "visualization", "metrics"],
            form: ["form", "input", "submit", "contact", "sign up", "login"],
            modal: ["modal", "dialog", "popup", "overlay", "confirm"],
            testimonial: ["testimonial", "review", "quote", "feedback", "customer"],
        };

        for (const [key, terms] of Object.entries(componentKeywords)) {
            if (terms.some(term => lowerDesc.includes(term))) {
                keywords.push(key);
            }
        }

        // Style keywords
        const styleKeywords = ["modern", "minimal", "clean", "professional", "vibrant", "dark", "light"];
        for (const style of styleKeywords) {
            if (lowerDesc.includes(style)) {
                keywords.push(`style:${style}`);
            }
        }

        return keywords;
    }

    /**
     * Select appropriate components based on keywords and description
     */
    private selectComponents(keywords: string[], description: string): ComponentSpec[] {
        const components: ComponentSpec[] = [];
        const lowerDesc = description.toLowerCase();

        // Map keywords to components with default props
        if (keywords.includes("pricing")) {
            components.push(this.createPricingTableSpec(description));
        }

        if (keywords.includes("dashboard")) {
            components.push(this.createDashboardSpec(description));
        }

        if (keywords.includes("chart")) {
            components.push(this.createChartSpec(description));
        }

        if (keywords.includes("form")) {
            components.push(this.createFormSpec(description));
        }

        if (keywords.includes("modal")) {
            components.push(this.createModalSpec(description));
        }

        if (keywords.includes("testimonial")) {
            components.push(this.createTestimonialSpec(description));
        }

        if (keywords.includes("card") || lowerDesc.includes("hero") || lowerDesc.includes("feature")) {
            components.push(this.createCardSpec(description));
        }

        // Always add a button if we have other components and it's a landing/marketing page
        if (components.length > 0 && (lowerDesc.includes("landing") || lowerDesc.includes("hero") || lowerDesc.includes("cta"))) {
            components.push(this.createButtonSpec(description));
        }

        // If no specific components detected, create a generic card + button
        if (components.length === 0) {
            components.push(this.createCardSpec(description));
            components.push(this.createButtonSpec(description));
        }

        return components;
    }

    /**
     * Component creation helpers
     */
    private createButtonSpec(description: string): ComponentSpec {
        const lowerDesc = description.toLowerCase();

        let text = "Get Started";
        if (lowerDesc.includes("contact")) text = "Contact Us";
        else if (lowerDesc.includes("sign up")) text = "Sign Up";
        else if (lowerDesc.includes("learn more")) text = "Learn More";
        else if (lowerDesc.includes("try")) text = "Try for Free";

        return {
            name: "Button",
            props: {
                text,
                variant: "solid",
                color: "primary",
                size: "lg",
            },
            metadata: {
                reason: "Primary call-to-action button",
            },
        };
    }

    private createCardSpec(description: string): ComponentSpec {
        const lowerDesc = description.toLowerCase();

        let variant: string = "elevated";
        if (lowerDesc.includes("modern") || lowerDesc.includes("glass")) {
            variant = "glass";
        } else if (lowerDesc.includes("gradient")) {
            variant = "gradient";
        }

        return {
            name: "Card",
            props: {
                variant,
                title: "Welcome",
                content: "Your content goes here. Describe your product or service.",
                hoverable: true,
                size: "lg",
            },
            metadata: {
                reason: "Content container for hero or feature section",
            },
        };
    }

    private createPricingTableSpec(_description: string): ComponentSpec {
        return {
            name: "PricingTable",
            props: {
                headline: "Choose Your Plan",
                subheadline: "Select the perfect plan for your needs",
                tiers: [
                    {
                        id: "starter",
                        name: "Starter",
                        price: 9,
                        currency: "USD",
                        billingPeriod: "month",
                        description: "Perfect for getting started",
                        features: [
                            { text: "5 Projects", included: true },
                            { text: "Basic Support", included: true },
                            { text: "1GB Storage", included: true },
                            { text: "API Access", included: false },
                        ],
                        ctaText: "Get Started",
                    },
                    {
                        id: "pro",
                        name: "Professional",
                        price: 29,
                        currency: "USD",
                        billingPeriod: "month",
                        description: "Best for professionals",
                        features: [
                            { text: "Unlimited Projects", included: true },
                            { text: "Priority Support", included: true },
                            { text: "10GB Storage", included: true },
                            { text: "API Access", included: true },
                        ],
                        ctaText: "Start Free Trial",
                        featured: true,
                        badge: "Most Popular",
                    },
                    {
                        id: "enterprise",
                        name: "Enterprise",
                        price: 99,
                        currency: "USD",
                        billingPeriod: "month",
                        description: "For large organizations",
                        features: [
                            { text: "Unlimited Everything", included: true },
                            { text: "24/7 Support", included: true },
                            { text: "Unlimited Storage", included: true },
                            { text: "Custom Integrations", included: true },
                        ],
                        ctaText: "Contact Sales",
                    },
                ],
                showBillingToggle: true,
                yearlyDiscount: 20,
            },
            metadata: {
                reason: "Pricing table for SaaS subscription plans",
            },
        };
    }

    private createDashboardSpec(_description: string): ComponentSpec {
        return {
            name: "DashboardLayout",
            props: {
                sidebar: {
                    title: "Dashboard",
                    navItems: [
                        { id: "home", label: "Home", icon: "home", href: "/", active: true },
                        { id: "analytics", label: "Analytics", icon: "bar-chart", href: "/analytics" },
                        { id: "projects", label: "Projects", icon: "folder", href: "/projects" },
                        { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
                    ],
                    collapsible: true,
                    showUserProfile: true,
                    userInfo: {
                        name: "John Doe",
                        email: "john@example.com",
                    },
                },
                showSidebar: true,
                header: {
                    title: "Overview",
                    showSearch: true,
                    showNotifications: true,
                    showUserMenu: true,
                },
                showHeader: true,
                pageTitle: "Dashboard",
                contentPadding: "md",
            },
            metadata: {
                reason: "Dashboard layout with navigation sidebar and header",
            },
        };
    }

    private createChartSpec(_description: string): ComponentSpec {
        return {
            name: "Chart",
            props: {
                type: "line",
                title: "Performance Overview",
                subtitle: "Last 6 months",
                data: [
                    { name: "Jan", value: 1200 },
                    { name: "Feb", value: 1900 },
                    { name: "Mar", value: 1500 },
                    { name: "Apr", value: 2400 },
                    { name: "May", value: 2100 },
                    { name: "Jun", value: 2800 },
                ],
                showLegend: true,
                showGrid: true,
                animated: true,
                colorScheme: "default",
            },
            metadata: {
                reason: "Data visualization chart",
            },
        };
    }

    private createFormSpec(_description: string): ComponentSpec {
        return {
            name: "Form",
            props: {
                title: "Contact Us",
                description: "Fill out the form below and we'll get back to you",
                fields: [
                    { id: "name", name: "name", type: "text", label: "Full Name", placeholder: "John Doe", required: true },
                    { id: "email", name: "email", type: "email", label: "Email", placeholder: "john@example.com", required: true },
                    { id: "message", name: "message", type: "textarea", label: "Message", placeholder: "How can we help?", required: true },
                ],
                submitText: "Send Message",
                showSubmitButton: true,
                showValidationOnBlur: true,
            },
            metadata: {
                reason: "Contact or input form",
            },
        };
    }

    private createModalSpec(_description: string): ComponentSpec {
        return {
            name: "Modal",
            props: {
                title: "Confirm Action",
                description: "Are you sure you want to proceed?",
                variant: "default",
                size: "md",
                showCloseButton: true,
                primaryAction: {
                    text: "Confirm",
                    variant: "solid",
                },
                secondaryAction: {
                    text: "Cancel",
                    variant: "outline",
                },
                isOpen: true,
            },
            metadata: {
                reason: "Modal dialog for confirmations or focused content",
            },
        };
    }

    private createTestimonialSpec(_description: string): ComponentSpec {
        return {
            name: "TestimonialSection",
            props: {
                headline: "What Our Customers Say",
                subheadline: "Don't just take our word for it",
                testimonials: [
                    {
                        id: "1",
                        quote: "This product has completely transformed how we work. Highly recommended!",
                        authorName: "Sarah Johnson",
                        authorRole: "CEO",
                        authorCompany: "TechCorp",
                        rating: 5,
                    },
                    {
                        id: "2",
                        quote: "The best investment we've made this year. The results speak for themselves.",
                        authorName: "Michael Chen",
                        authorRole: "Director of Operations",
                        authorCompany: "StartupXYZ",
                        rating: 5,
                    },
                    {
                        id: "3",
                        quote: "Incredible support team and a product that just works. Love it!",
                        authorName: "Emily Brown",
                        authorRole: "Product Manager",
                        authorCompany: "InnovateCo",
                        rating: 5,
                    },
                ],
                layout: "grid",
                columns: 3,
                showRatings: true,
                showAvatars: true,
                cardStyle: "elevated",
            },
            metadata: {
                reason: "Customer testimonials for social proof",
            },
        };
    }

    /**
     * Determine layout based on components
     */
    private determineLayout(components: ComponentSpec[]): UISpec["layout"] {
        const hasFullWidth = components.some(c =>
            c.name === "DashboardLayout" || c.name === "PricingTable"
        );

        if (hasFullWidth) {
            return { type: "stack", spacing: "0" };
        }

        return {
            type: "stack",
            spacing: "2rem",
            maxWidth: "1200px",
        };
    }

    /**
     * Generate a descriptive name for the UI
     */
    private generateUIName(description: string): string {
        const lowerDesc = description.toLowerCase();

        if (lowerDesc.includes("pricing")) return "Pricing Page";
        if (lowerDesc.includes("dashboard")) return "Dashboard";
        if (lowerDesc.includes("landing")) return "Landing Page";
        if (lowerDesc.includes("hero")) return "Hero Section";
        if (lowerDesc.includes("contact")) return "Contact Form";
        if (lowerDesc.includes("testimonial")) return "Testimonials Section";

        return "Generated UI";
    }

    /**
     * Determine what modifications to make based on request
     */
    private determineModifications(request: string, keywords: string[]): Array<{
        action: "add" | "remove" | "update" | "replace";
        componentIndex?: number;
        component?: ComponentSpec;
        props?: Record<string, unknown>;
    }> {
        const modifications: Array<{
            action: "add" | "remove" | "update" | "replace";
            componentIndex?: number;
            component?: ComponentSpec;
            props?: Record<string, unknown>;
        }> = [];

        const lowerRequest = request.toLowerCase();

        // Handle style modifications
        if (lowerRequest.includes("more modern") || lowerRequest.includes("modern")) {
            modifications.push({
                action: "update",
                componentIndex: 0,
                props: { variant: "glass" },
            });
        }

        if (lowerRequest.includes("bigger") || lowerRequest.includes("larger")) {
            modifications.push({
                action: "update",
                componentIndex: 0,
                props: { size: "xl" },
            });
        }

        if (lowerRequest.includes("smaller")) {
            modifications.push({
                action: "update",
                componentIndex: 0,
                props: { size: "sm" },
            });
        }

        // Handle adding components
        if (lowerRequest.includes("add button") || lowerRequest.includes("add cta")) {
            modifications.push({
                action: "add",
                component: this.createButtonSpec(request),
            });
        }

        if (lowerRequest.includes("add testimonial")) {
            modifications.push({
                action: "add",
                component: this.createTestimonialSpec(request),
            });
        }

        return modifications;
    }
}

export function createUIArchitectAgent(context: AgentContext): UIArchitectAgent {
    return new UIArchitectAgent(context);
}
