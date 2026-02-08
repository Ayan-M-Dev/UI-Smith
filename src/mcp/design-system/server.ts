/**
 * Design System MCP Server
 * ========================
 * Purpose: Exposes allowed components, props, variants, and layout rules.
 *          Prevents invalid UI composition by providing schema validation.
 * 
 * Tools:
 * - get_component_list: Returns all available components
 * - get_component_schema: Returns Zod schema for a specific component
 * - validate_props: Validates props against component schema
 * - get_layout_rules: Returns layout composition rules
 * - get_design_tokens: Returns design system tokens (colors, spacing, etc.)
 * 
 * Resources:
 * - design://components: List of all components
 * - design://tokens: Design token definitions
 * - design://rules: Layout and composition rules
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import component schemas
import { tamboComponents } from "../../tambo/component-registry";
import { componentRegistry } from "../../tambo/component-registry";

const server = new McpServer({
    name: "design-system",
    version: "1.0.0",
});

// ============================================================================
// DESIGN TOKENS
// ============================================================================

const designTokens = {
    colors: {
        primary: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
        },
        secondary: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
        },
        accent: {
            cyan: "#06b6d4",
            teal: "#14b8a6",
        },
        semantic: {
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
            info: "#3b82f6",
        },
    },
    spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
    },
    borderRadius: {
        none: "0",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
    },
    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    },
    typography: {
        fontFamily: {
            sans: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        },
        fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
        },
    },
};

// ============================================================================
// LAYOUT RULES
// ============================================================================

const layoutRules = {
    composition: [
        {
            rule: "max-components-per-view",
            value: 10,
            description: "Limit to 10 major components per view to avoid cognitive overload",
        },
        {
            rule: "cta-placement",
            value: "above-fold",
            description: "Primary CTAs should be visible without scrolling",
        },
        {
            rule: "spacing-consistency",
            value: "use-design-tokens",
            description: "Always use spacing tokens, never arbitrary pixel values",
        },
        {
            rule: "hierarchy",
            value: "single-h1",
            description: "Each page should have exactly one H1 heading",
        },
    ],
    containers: {
        maxWidth: {
            prose: "65ch",
            content: "1200px",
            wide: "1400px",
        },
        minHeight: {
            section: "400px",
            hero: "80vh",
        },
    },
    responsive: {
        breakpoints: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        mobileFirst: true,
    },
    componentPairs: {
        recommended: [
            { parent: "DashboardLayout", children: ["Chart", "Card", "Button"] },
            { parent: "PricingTable", children: ["Button"] },
            { parent: "Form", children: ["Button"] },
            { parent: "Modal", children: ["Button", "Form"] },
        ],
        discouraged: [
            { parent: "Modal", children: ["Modal"], reason: "Avoid nested modals" },
            { parent: "Form", children: ["PricingTable"], reason: "Forms should not contain pricing tables" },
        ],
    },
};

// ============================================================================
// TOOLS
// ============================================================================

// Tool: Get all available components
server.tool(
    "get_component_list",
    "Returns a list of all available UI components in the design system",
    {},
    async () => {
        const components = tamboComponents.map((comp) => ({
            name: comp.name,
            description: comp.description.split("\n")[0].trim(), // First line only
        }));

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({ components, count: components.length }, null, 2),
                },
            ],
        };
    }
);

// Tool: Get component schema
server.tool(
    "get_component_schema",
    "Returns the full prop schema and documentation for a specific component",
    {
        componentName: z.string().describe("Name of the component to get schema for"),
    },
    async ({ componentName }) => {
        const component = componentRegistry.get(componentName);

        if (!component) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify({
                            error: `Component "${componentName}" not found`,
                            availableComponents: componentRegistry.getNames(),
                        }),
                    },
                ],
                isError: true,
            };
        }

        // Get schema shape (simplified for demonstration)
        const schemaShape = component.propsSchema._def;

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(
                        {
                            name: component.name,
                            description: component.description,
                            schemaType: schemaShape.typeName,
                            // In production, you'd serialize the full schema
                        },
                        null,
                        2
                    ),
                },
            ],
        };
    }
);

// Tool: Validate props
server.tool(
    "validate_props",
    "Validates props against a component's schema, returns validation errors if any",
    {
        componentName: z.string().describe("Name of the component"),
        props: z.record(z.unknown()).describe("Props object to validate"),
    },
    async ({ componentName, props }) => {
        const component = componentRegistry.get(componentName);

        if (!component) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify({
                            valid: false,
                            error: `Component "${componentName}" not found`,
                        }),
                    },
                ],
                isError: true,
            };
        }

        try {
            const result = component.propsSchema.safeParse(props);

            if (result.success) {
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: JSON.stringify({
                                valid: true,
                                validatedProps: result.data,
                            }, null, 2),
                        },
                    ],
                };
            } else {
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: JSON.stringify({
                                valid: false,
                                errors: result.error.errors.map((e: any) => ({
                                    path: e.path.join("."),
                                    message: e.message,
                                    code: e.code,
                                })),
                            }, null, 2),
                        },
                    ],
                };
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify({
                            valid: false,
                            error: String(error),
                        }),
                    },
                ],
                isError: true,
            };
        }
    }
);

// Tool: Get layout rules
server.tool(
    "get_layout_rules",
    "Returns layout and composition rules for building UIs",
    {
        category: z
            .enum(["composition", "containers", "responsive", "componentPairs", "all"])
            .optional()
            .default("all")
            .describe("Category of rules to retrieve"),
    },
    async ({ category }) => {
        let rules: Record<string, unknown>;

        if (category === "all") {
            rules = layoutRules;
        } else {
            rules = { [category]: layoutRules[category] };
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(rules, null, 2),
                },
            ],
        };
    }
);

// Tool: Get design tokens
server.tool(
    "get_design_tokens",
    "Returns design system tokens (colors, spacing, typography, etc.)",
    {
        category: z
            .enum(["colors", "spacing", "borderRadius", "shadows", "typography", "all"])
            .optional()
            .default("all")
            .describe("Category of tokens to retrieve"),
    },
    async ({ category }) => {
        let tokens: Record<string, unknown>;

        if (category === "all") {
            tokens = designTokens;
        } else {
            tokens = { [category]: designTokens[category as keyof typeof designTokens] };
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(tokens, null, 2),
                },
            ],
        };
    }
);

// ============================================================================
// RESOURCES
// ============================================================================

server.resource(
    "design://components",
    "design://components",
    async () => ({
        contents: [
            {
                uri: "design://components",
                text: JSON.stringify(componentRegistry.getDescriptions(), null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

server.resource(
    "design://tokens",
    "design://tokens",
    async () => ({
        contents: [
            {
                uri: "design://tokens",
                text: JSON.stringify(designTokens, null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

server.resource(
    "design://rules",
    "design://rules",
    async () => ({
        contents: [
            {
                uri: "design://rules",
                text: JSON.stringify(layoutRules, null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Design System MCP Server running on stdio");
}

main().catch(console.error);
