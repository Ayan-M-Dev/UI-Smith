/**
 * UX Best Practices MCP Server
 * ============================
 * Purpose: Provides UX heuristics, layout recommendations, and mobile-first rules.
 * 
 * Tools:
 * - analyze_layout: Analyzes a layout for UX issues
 * - get_cta_recommendations: Recommendations for call-to-action placement
 * - check_mobile_readiness: Validates mobile-first design
 * - get_visual_hierarchy_tips: Tips for visual hierarchy
 * - analyze_user_flow: Analyzes user journey for friction points
 * 
 * Resources:
 * - ux://heuristics: Nielsen's 10 usability heuristics
 * - ux://patterns: Common UI patterns and when to use them
 * - ux://mobile-first: Mobile-first design principles
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "ux-best-practices",
    version: "1.0.0",
});

// ============================================================================
// UX HEURISTICS (Nielsen's 10)
// ============================================================================

const nielsensHeuristics = [
    {
        id: 1,
        name: "Visibility of system status",
        description: "Keep users informed about what's going on through appropriate feedback within reasonable time",
        examples: [
            "Loading indicators",
            "Progress bars",
            "Success/error messages",
            "Form validation feedback",
        ],
        antiPatterns: [
            "Silent failures",
            "Actions with no feedback",
            "Unclear loading states",
        ],
    },
    {
        id: 2,
        name: "Match between system and real world",
        description: "Use words, phrases, and concepts familiar to the user rather than system-oriented terms",
        examples: [
            "Shopping cart icon for e-commerce",
            "Trash can for delete",
            "Natural language labels",
        ],
        antiPatterns: [
            "Technical jargon",
            "Unclear icons without labels",
            "Unfamiliar terminology",
        ],
    },
    {
        id: 3,
        name: "User control and freedom",
        description: "Users often make mistakes. Provide clearly marked exits and undo functionality",
        examples: [
            "Undo actions",
            "Cancel buttons",
            "Back navigation",
            "Edit/delete options",
        ],
        antiPatterns: [
            "Irreversible actions without confirmation",
            "No way to cancel",
            "Trapped user flows",
        ],
    },
    {
        id: 4,
        name: "Consistency and standards",
        description: "Follow platform conventions. Users shouldn't have to wonder whether different words, situations, or actions mean the same thing",
        examples: [
            "Consistent button styles",
            "Standard icons",
            "Predictable navigation",
        ],
        antiPatterns: [
            "Inconsistent styling",
            "Different icons for same action",
            "Unexpected behaviors",
        ],
    },
    {
        id: 5,
        name: "Error prevention",
        description: "Design to prevent errors before they happen. Eliminate error-prone conditions or check for them",
        examples: [
            "Confirmation dialogs for destructive actions",
            "Input validation",
            "Disabled states for invalid actions",
        ],
        antiPatterns: [
            "Easy to click wrong button",
            "No validation until submit",
            "Destructive actions too accessible",
        ],
    },
    {
        id: 6,
        name: "Recognition rather than recall",
        description: "Minimize user memory load by making options visible. Don't make users remember information",
        examples: [
            "Visible navigation",
            "Autocomplete",
            "Recent items lists",
            "Visual cues",
        ],
        antiPatterns: [
            "Hidden options",
            "Requiring memorization",
            "Complex command syntax",
        ],
    },
    {
        id: 7,
        name: "Flexibility and efficiency of use",
        description: "Accelerators for expert users without affecting novices",
        examples: [
            "Keyboard shortcuts",
            "Favorites/bookmarks",
            "Customizable interfaces",
        ],
        antiPatterns: [
            "No shortcuts",
            "One-size-fits-all only",
            "No personalization",
        ],
    },
    {
        id: 8,
        name: "Aesthetic and minimalist design",
        description: "Dialogues should not contain irrelevant or rarely needed information",
        examples: [
            "Clean layouts",
            "Progressive disclosure",
            "Focused content",
        ],
        antiPatterns: [
            "Cluttered interfaces",
            "Too many options at once",
            "Visual noise",
        ],
    },
    {
        id: 9,
        name: "Help users recognize, diagnose, and recover from errors",
        description: "Error messages should be expressed in plain language and suggest constructive solutions",
        examples: [
            "Clear error messages",
            "Suggested fixes",
            "Inline validation",
        ],
        antiPatterns: [
            "Technical error codes",
            "Vague messages",
            "No suggested resolution",
        ],
    },
    {
        id: 10,
        name: "Help and documentation",
        description: "Provide help that is easy to search, focused on tasks, and lists concrete steps",
        examples: [
            "Tooltips",
            "Contextual help",
            "FAQ sections",
            "Guided tours",
        ],
        antiPatterns: [
            "No help available",
            "Outdated documentation",
            "Hard to find help",
        ],
    },
];

// ============================================================================
// UI PATTERNS
// ============================================================================

const uiPatterns = {
    navigation: [
        {
            name: "Sidebar Navigation",
            useWhen: "Complex apps with many sections",
            avoid: "Simple marketing pages",
            components: ["DashboardLayout"],
        },
        {
            name: "Tab Navigation",
            useWhen: "Content that can be categorized into distinct groups",
            avoid: "More than 5-7 tabs",
            components: ["Card", "Form"],
        },
        {
            name: "Breadcrumbs",
            useWhen: "Deep hierarchical navigation",
            avoid: "Flat site structures",
            components: ["DashboardLayout"],
        },
    ],
    content: [
        {
            name: "Cards",
            useWhen: "Displaying collections of related items",
            avoid: "Long-form content",
            components: ["Card"],
        },
        {
            name: "Data Tables",
            useWhen: "Displaying structured data for comparison",
            avoid: "Mobile-primary experiences",
            components: ["PricingTable"],
        },
        {
            name: "Modals/Dialogs",
            useWhen: "Focused tasks, confirmations, alerts",
            avoid: "Complex multi-step processes",
            components: ["Modal"],
        },
    ],
    input: [
        {
            name: "Inline Forms",
            useWhen: "Quick edits, single field updates",
            avoid: "Complex data entry",
            components: ["Form"],
        },
        {
            name: "Multi-step Wizard",
            useWhen: "Long forms, complex processes",
            avoid: "Simple data collection",
            components: ["Form"],
        },
    ],
    feedback: [
        {
            name: "Toast Notifications",
            useWhen: "Non-blocking feedback messages",
            avoid: "Critical errors requiring action",
            components: ["Button"],
        },
        {
            name: "Inline Validation",
            useWhen: "Form inputs that can be validated immediately",
            avoid: "Server-side only validation",
            components: ["Form"],
        },
    ],
};

// ============================================================================
// MOBILE-FIRST PRINCIPLES
// ============================================================================

const mobileFirstPrinciples = {
    core: [
        {
            principle: "Content First",
            description: "Prioritize essential content, remove the unnecessary",
            implementation: "Start with mobile wireframes, add complexity for larger screens",
        },
        {
            principle: "Touch-Friendly Targets",
            description: "Minimum 44x44px touch targets",
            implementation: "Use larger buttons, adequate spacing between interactive elements",
        },
        {
            principle: "Progressive Enhancement",
            description: "Build for the lowest common denominator, enhance for capable devices",
            implementation: "Core functionality works everywhere, advanced features for modern browsers",
        },
        {
            principle: "Performance First",
            description: "Mobile networks are slow and unreliable",
            implementation: "Optimize images, minimize JS, lazy load when possible",
        },
    ],
    layout: [
        {
            rule: "Single Column Default",
            description: "Mobile uses single column, expand for larger screens",
            breakpoint: "md (768px)",
        },
        {
            rule: "Collapsible Navigation",
            description: "Navigation should collapse to hamburger on mobile",
            breakpoint: "lg (1024px)",
        },
        {
            rule: "Stacked Forms",
            description: "Form fields stack vertically on mobile",
            breakpoint: "sm (640px)",
        },
    ],
    typography: [
        {
            rule: "Minimum 16px Base Font",
            description: "Prevents zoom on iOS when focusing inputs",
        },
        {
            rule: "Readable Line Length",
            description: "45-75 characters per line for optimal readability",
        },
        {
            rule: "Appropriate Line Height",
            description: "1.5-1.7 for body text on mobile",
        },
    ],
};

// ============================================================================
// TOOLS
// ============================================================================

// Tool: Analyze layout
server.tool(
    "analyze_layout",
    "Analyzes a component layout for UX issues and provides recommendations",
    {
        components: z.array(z.object({
            name: z.string(),
            position: z.enum(["header", "main", "sidebar", "footer", "modal", "floating"]).optional(),
            props: z.record(z.unknown()).optional(),
        })).describe("Components in the layout"),
        pageType: z.enum(["landing", "dashboard", "form", "pricing", "settings", "content"]).describe("Type of page"),
    },
    async ({ components, pageType }) => {
        const analysis = {
            pageType,
            componentCount: components.length,
            issues: [] as Array<{ severity: string; issue: string; recommendation: string }>,
            scores: {
                clarity: 0,
                efficiency: 0,
                consistency: 0,
                overall: 0,
            },
            recommendations: [] as string[],
        };

        // Check for cognitive overload
        if (components.length > 10) {
            analysis.issues.push({
                severity: "warning",
                issue: `High component count (${components.length})`,
                recommendation: "Consider simplifying the layout or using progressive disclosure",
            });
        }

        // Check for CTA presence on landing pages
        if (pageType === "landing") {
            const hasButton = components.some((c) => c.name === "Button");
            if (!hasButton) {
                analysis.issues.push({
                    severity: "error",
                    issue: "No CTA button on landing page",
                    recommendation: "Add a clear call-to-action button above the fold",
                });
            }
        }

        // Check for form validation
        if (pageType === "form") {
            const formComponent = components.find((c) => c.name === "Form");
            if (formComponent && !formComponent.props?.showValidationOnBlur) {
                analysis.issues.push({
                    severity: "suggestion",
                    issue: "Form validation not enabled",
                    recommendation: "Enable inline validation for better user experience",
                });
            }
        }

        // Calculate scores
        analysis.scores.clarity = Math.max(0, 100 - (components.length - 5) * 5);
        analysis.scores.efficiency = analysis.issues.length < 2 ? 90 : 70;
        analysis.scores.consistency = 85; // Base score
        analysis.scores.overall = Math.round(
            (analysis.scores.clarity + analysis.scores.efficiency + analysis.scores.consistency) / 3
        );

        // Add general recommendations
        if (analysis.scores.overall < 80) {
            analysis.recommendations.push(
                "Review layout for unnecessary complexity",
                "Ensure primary actions are clearly visible",
                "Consider user testing to validate the design"
            );
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(analysis, null, 2),
                },
            ],
        };
    }
);

// Tool: Get CTA recommendations
server.tool(
    "get_cta_recommendations",
    "Provides recommendations for call-to-action placement and design",
    {
        pageType: z.enum(["landing", "pricing", "signup", "dashboard", "product"]).describe("Type of page"),
        primaryAction: z.string().describe("The primary action you want users to take"),
        secondaryAction: z.string().optional().describe("Optional secondary action"),
    },
    async ({ pageType, primaryAction, secondaryAction }) => {
        const recommendations = {
            pageType,
            primaryCTA: {
                action: primaryAction,
                placement: [] as string[],
                styling: [] as string[],
                copy: [] as string[],
            },
            secondaryCTA: secondaryAction
                ? {
                    action: secondaryAction,
                    placement: [] as string[],
                    styling: [] as string[],
                }
                : null,
            generalTips: [] as string[],
        };

        // Primary CTA recommendations by page type
        switch (pageType) {
            case "landing":
                recommendations.primaryCTA.placement = [
                    "Above the fold in hero section",
                    "After key value propositions",
                    "Floating/sticky on mobile",
                ];
                recommendations.primaryCTA.styling = [
                    "Use solid variant with primary color",
                    "Make it large (lg or xl size)",
                    "Add subtle animation or shadow",
                ];
                break;
            case "pricing":
                recommendations.primaryCTA.placement = [
                    "Within each pricing tier card",
                    "Highlighted on recommended tier",
                    "Sticky footer on mobile",
                ];
                recommendations.primaryCTA.styling = [
                    "Use solid variant for recommended tier",
                    "Use outline variant for other tiers",
                    "Consistent sizing across tiers",
                ];
                break;
            case "signup":
                recommendations.primaryCTA.placement = [
                    "Below the form",
                    "Full width on mobile",
                    "Right-aligned on desktop",
                ];
                recommendations.primaryCTA.styling = [
                    "Use solid variant with primary color",
                    "Match form width for visual balance",
                ];
                break;
        }

        // Copy recommendations
        recommendations.primaryCTA.copy = [
            "Use action-oriented verbs (Get, Start, Try, Join)",
            "Include value proposition (Get Started Free, Start Your Trial)",
            "Create urgency when appropriate (Join 10,000+ users)",
        ];

        // Secondary CTA
        if (secondaryAction) {
            recommendations.secondaryCTA = {
                action: secondaryAction,
                placement: ["Adjacent to primary CTA", "In header navigation"],
                styling: ["Use outline or ghost variant", "Smaller or equal size to primary"],
            };
        }

        // General tips
        recommendations.generalTips = [
            "Limit to 1-2 CTAs per view to avoid decision paralysis",
            "Make the primary action visually dominant",
            "Use contrasting colors that stand out from the page",
            "Ensure CTAs are keyboard accessible",
            "Test CTA performance with A/B testing",
        ];

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(recommendations, null, 2),
                },
            ],
        };
    }
);

// Tool: Check mobile readiness
server.tool(
    "check_mobile_readiness",
    "Validates that the design follows mobile-first principles",
    {
        components: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()).optional(),
        })).describe("Components to check"),
    },
    async ({ components }) => {
        const report = {
            passed: true,
            checks: [] as Array<{ check: string; status: "pass" | "fail" | "warning"; notes: string }>,
            score: 100,
        };

        // Check for responsive layouts
        const dashboardLayout = components.find((c) => c.name === "DashboardLayout");
        if (dashboardLayout) {
            report.checks.push({
                check: "Responsive sidebar",
                status: "pass",
                notes: "DashboardLayout has built-in mobile menu support",
            });
        }

        // Check for touch-friendly components
        const buttons = components.filter((c) => c.name === "Button");
        buttons.forEach((btn, index) => {
            const size = (btn.props?.size as string) || "md";
            if (["xs", "sm"].includes(size)) {
                report.checks.push({
                    check: `Button ${index + 1} touch target`,
                    status: "warning",
                    notes: `Size '${size}' may be too small for touch. Consider 'md' or larger.`,
                });
                report.score -= 5;
            } else {
                report.checks.push({
                    check: `Button ${index + 1} touch target`,
                    status: "pass",
                    notes: "Adequate size for touch interactions",
                });
            }
        });

        // Check for form field sizing
        const forms = components.filter((c) => c.name === "Form");
        forms.forEach((form) => {
            const size = (form.props?.size as string) || "md";
            if (size === "xs") {
                report.checks.push({
                    check: "Form field sizes",
                    status: "fail",
                    notes: "Form size 'xs' is too small for mobile. Use 'sm' or larger.",
                });
                report.score -= 10;
                report.passed = false;
            }
        });

        // Add general mobile checks
        report.checks.push({
            check: "Responsive component library",
            status: "pass",
            notes: "All UI-Smith components are built with responsive design",
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(report, null, 2),
                },
            ],
        };
    }
);

// Tool: Get visual hierarchy tips
server.tool(
    "get_visual_hierarchy_tips",
    "Provides tips for improving visual hierarchy in the design",
    {
        purpose: z.enum(["landing", "dashboard", "content", "form", "ecommerce"]).describe("Purpose of the page"),
    },
    async ({ purpose }) => {
        const tips = {
            purpose,
            principles: [
                {
                    principle: "Size Matters",
                    description: "Larger elements draw more attention",
                    application: "Use largest typography for primary headlines",
                },
                {
                    principle: "Color Contrast",
                    description: "High contrast elements stand out",
                    application: "Use primary color for CTAs, muted for secondary elements",
                },
                {
                    principle: "Whitespace",
                    description: "Space around elements increases perceived importance",
                    application: "Give key content room to breathe",
                },
                {
                    principle: "Alignment",
                    description: "Aligned elements create order and relationships",
                    application: "Use consistent grid and alignment throughout",
                },
                {
                    principle: "Typography Weight",
                    description: "Bold text attracts more attention than regular",
                    application: "Use semibold/bold for headings, regular for body",
                },
            ],
            purposeSpecific: [] as Array<{ tip: string; component: string }>,
        };

        // Purpose-specific tips
        switch (purpose) {
            case "landing":
                tips.purposeSpecific = [
                    { tip: "Hero headline should be largest text on page", component: "Card" },
                    { tip: "Primary CTA should use contrasting solid variant", component: "Button" },
                    { tip: "Testimonials add social proof credibility", component: "TestimonialSection" },
                ];
                break;
            case "dashboard":
                tips.purposeSpecific = [
                    { tip: "Key metrics should be prominent at top", component: "Card" },
                    { tip: "Navigation should be clearly organized", component: "DashboardLayout" },
                    { tip: "Charts should highlight important data points", component: "Chart" },
                ];
                break;
            case "form":
                tips.purposeSpecific = [
                    { tip: "Form title should explain the purpose", component: "Form" },
                    { tip: "Required fields should be clearly marked", component: "Form" },
                    { tip: "Submit button should be visually prominent", component: "Button" },
                ];
                break;
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(tips, null, 2),
                },
            ],
        };
    }
);

// Tool: Analyze user flow
server.tool(
    "analyze_user_flow",
    "Analyzes a user flow for potential friction points",
    {
        steps: z.array(z.object({
            step: z.string(),
            component: z.string().optional(),
            userAction: z.string(),
        })).describe("Steps in the user flow"),
        goal: z.string().describe("The end goal of the flow"),
    },
    async ({ steps, goal }) => {
        const analysis = {
            goal,
            stepsCount: steps.length,
            frictionPoints: [] as Array<{ step: number; issue: string; suggestion: string }>,
            optimizations: [] as string[],
            score: 100,
        };

        // Check for too many steps
        if (steps.length > 5) {
            analysis.frictionPoints.push({
                step: steps.length,
                issue: `Flow has ${steps.length} steps, which may cause drop-off`,
                suggestion: "Consider combining steps or using progressive disclosure",
            });
            analysis.score -= 10;
        }

        // Analyze each step
        steps.forEach((step, index) => {
            // Check for form submissions
            if (step.userAction.toLowerCase().includes("submit") && index < steps.length - 2) {
                analysis.frictionPoints.push({
                    step: index + 1,
                    issue: "Form submission in the middle of flow",
                    suggestion: "Consider deferring submission until the end",
                });
                analysis.score -= 5;
            }

            // Check for modal usage
            if (step.component === "Modal" && index > 0) {
                analysis.frictionPoints.push({
                    step: index + 1,
                    issue: "Modal interrupts flow",
                    suggestion: "Consider inline content instead of modal",
                });
                analysis.score -= 5;
            }
        });

        // Add optimizations
        analysis.optimizations = [
            "Add progress indicator to show users where they are",
            "Provide clear back/cancel options at each step",
            "Save progress to prevent data loss",
            "Provide inline validation for immediate feedback",
            "Consider social login to reduce form fatigue",
        ];

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(analysis, null, 2),
                },
            ],
        };
    }
);

// ============================================================================
// RESOURCES
// ============================================================================

server.resource(
    "ux://heuristics",
    "ux://heuristics",
    async () => ({
        contents: [
            {
                uri: "ux://heuristics",
                text: JSON.stringify(nielsensHeuristics, null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

server.resource(
    "ux://patterns",
    "ux://patterns",
    async () => ({
        contents: [
            {
                uri: "ux://patterns",
                text: JSON.stringify(uiPatterns, null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

server.resource(
    "ux://mobile-first",
    "ux://mobile-first",
    async () => ({
        contents: [
            {
                uri: "ux://mobile-first",
                text: JSON.stringify(mobileFirstPrinciples, null, 2),
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
    console.error("UX Best Practices MCP Server running on stdio");
}

main().catch(console.error);
