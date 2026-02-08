/**
 * Design Critic Agent
 * ===================
 * Reviews and improves UI designs for visual quality.
 * 
 * Responsibilities:
 * - Evaluate spacing and visual rhythm
 * - Assess visual hierarchy
 * - Check color harmony and contrast
 * - Suggest aesthetic improvements
 * - Ensure design consistency
 * 
 * Tools Access:
 * - Design System MCP: get_design_tokens, get_layout_rules
 * - UX Best Practices MCP: analyze_layout, get_visual_hierarchy_tips
 */

import { AgentConfig, AgentResponse, UISpec, DesignFeedback, ComponentSpec } from "./types";

export const designCriticConfig: AgentConfig = {
    name: "Design Critic",
    role: "design-critic",
    systemPrompt: `You are the Design Critic agent for UI-Smith. Your role is to review UI designs and suggest improvements for visual quality and user experience.

## Your Focus Areas
1. **Visual Hierarchy** - Is the most important content prominent?
2. **Spacing & Rhythm** - Is whitespace used effectively?
3. **Color & Contrast** - Do colors work well together?
4. **Consistency** - Are patterns used consistently?
5. **Balance & Alignment** - Is the layout balanced?

## Evaluation Criteria
- Score designs on a 0-100 scale
- Identify specific issues with actionable fixes
- Suggest improvements that can be applied via prop changes

## Output Format
Return a DesignFeedback object with:
- score: overall quality score (0-100)
- issues: array of specific problems found
- improvements: array of suggested changes

## Example
{
  "score": 75,
  "issues": [
    {
      "type": "spacing",
      "severity": "warning",
      "message": "Cards are too close together",
      "fix": { "props": { "className": "gap-6" } }
    }
  ],
  "improvements": [
    {
      "componentIndex": 0,
      "suggestion": "Use larger font size for headline",
      "proposedProps": { "size": "xl" }
    }
  ]
}
`,
    tools: [
        "design-system:get_design_tokens",
        "design-system:get_layout_rules",
        "ux:analyze_layout",
        "ux:get_visual_hierarchy_tips",
    ],
    temperature: 0.5,
    maxTokens: 2000,
};

/**
 * Design Critic Agent Class
 */
export class DesignCriticAgent {
    /**
     * Review a UI specification and provide feedback
     */
    async review(uiSpec: UISpec): Promise<AgentResponse> {
        try {
            const feedback = await this.analyzeDesign(uiSpec);

            // If there are critical issues, don't pass to next agent
            const hasCriticalIssues = feedback.issues.some(i => i.severity === "error");

            if (hasCriticalIssues) {
                return {
                    success: false,
                    data: feedback,
                    errors: [{
                        code: "DESIGN_ISSUES",
                        message: `Found ${feedback.issues.filter(i => i.severity === "error").length} critical design issues`,
                        severity: "error",
                    }],
                    suggestions: feedback.improvements.map(i => i.suggestion),
                };
            }

            // Optionally apply suggested improvements
            const improvedUI = this.applyImprovements(uiSpec, feedback);

            return {
                success: true,
                data: {
                    feedback,
                    improvedUI,
                },
                nextAgent: "accessibility",
            };
        } catch (error) {
            return {
                success: false,
                errors: [{
                    code: "REVIEW_ERROR",
                    message: String(error),
                    severity: "error",
                }],
            };
        }
    }

    /**
     * Analyze the design and generate feedback
     */
    private async analyzeDesign(uiSpec: UISpec): Promise<DesignFeedback> {
        const feedback: DesignFeedback = {
            score: 100,
            issues: [],
            improvements: [],
        };

        // Analyze each component
        uiSpec.components.forEach((component, index) => {
            this.checkComponent(component, index, feedback);
        });

        // Check overall layout
        this.checkLayout(uiSpec, feedback);

        // Check consistency across components
        this.checkConsistency(uiSpec.components, feedback);

        // Calculate final score
        feedback.score = this.calculateScore(feedback);

        return feedback;
    }

    /**
     * Check individual component for design issues
     */
    private checkComponent(
        component: ComponentSpec,
        index: number,
        feedback: DesignFeedback
    ): void {
        const props = component.props as Record<string, unknown>;

        // Check button design
        if (component.name === "Button") {
            // Check for size appropriateness
            const size = props.size as string;
            if (size === "xs" || size === "sm") {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Consider using a larger button for better visibility",
                    proposedProps: { size: "md" },
                });
            }

            // Check for icon-only buttons without labels
            if (props.iconOnly && !props.ariaLabel && !props["aria-label"]) {
                feedback.issues.push({
                    type: "hierarchy",
                    severity: "warning",
                    message: `Button at index ${index} is icon-only without an aria-label`,
                });
            }
        }

        // Check card design
        if (component.name === "Card") {
            // Check for missing title
            if (!props.title && !props.header) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Add a title for better visual hierarchy",
                    proposedProps: { title: "Section Title" },
                });
            }

            // Check variant
            if (!props.variant) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Specify a card variant for visual interest",
                    proposedProps: { variant: "elevated" },
                });
            }
        }

        // Check pricing table
        if (component.name === "PricingTable") {
            const tiers = props.tiers as Array<Record<string, unknown>> | undefined;

            // Check for featured tier
            if (tiers && !tiers.some(t => t.featured)) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Mark one tier as featured to guide user attention",
                });
            }

            // Check tier count
            if (tiers && tiers.length < 2) {
                feedback.issues.push({
                    type: "hierarchy",
                    severity: "suggestion",
                    message: "Consider adding more pricing tiers for comparison",
                });
            }
        }

        // Check form design
        if (component.name === "Form") {
            // Check for validation
            if (!props.showValidationOnBlur && !props.showValidationOnChange) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Enable validation feedback for better UX",
                    proposedProps: { showValidationOnBlur: true },
                });
            }
        }

        // Check chart design
        if (component.name === "Chart") {
            // Check for title
            if (!props.title) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Add a title to provide context for the chart",
                    proposedProps: { title: "Data Overview" },
                });
            }

            // Check for legend
            if (props.showLegend === false) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Consider showing the legend for better data understanding",
                    proposedProps: { showLegend: true },
                });
            }
        }

        // Check dashboard layout
        if (component.name === "DashboardLayout") {
            const header = props.header as Record<string, unknown> | undefined;

            // Check for breadcrumbs on complex layouts
            if (header && !header.showBreadcrumbs) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Add breadcrumbs for better navigation context",
                });
            }
        }

        // Check testimonial section
        if (component.name === "TestimonialSection") {
            const testimonials = props.testimonials as Array<Record<string, unknown>> | undefined;

            // Check testimonial count
            if (testimonials && testimonials.length < 3) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Add more testimonials for stronger social proof",
                });
            }

            // Check for ratings
            if (!props.showRatings) {
                feedback.improvements.push({
                    componentIndex: index,
                    suggestion: "Show ratings to increase credibility",
                    proposedProps: { showRatings: true },
                });
            }
        }
    }

    /**
     * Check overall layout
     */
    private checkLayout(uiSpec: UISpec, feedback: DesignFeedback): void {
        // Check component count
        if (uiSpec.components.length > 10) {
            feedback.issues.push({
                type: "hierarchy",
                severity: "warning",
                message: "Too many components may cause cognitive overload",
            });
        }

        // Check for hero/main content
        const hasHeroContent = uiSpec.components.some(c => {
            const props = c.props as Record<string, unknown>;
            return c.name === "Card" && (props.size === "lg" || props.size === "xl");
        });

        if (!hasHeroContent && uiSpec.components.length > 0) {
            feedback.improvements.push({
                componentIndex: 0,
                suggestion: "Consider making the first element larger for visual impact",
                proposedProps: { size: "lg" },
            });
        }

        // Check for call-to-action
        const hasButton = uiSpec.components.some(c => c.name === "Button");
        if (!hasButton && !uiSpec.components.some(c => c.name === "Form")) {
            feedback.issues.push({
                type: "hierarchy",
                severity: "suggestion",
                message: "Consider adding a call-to-action button",
            });
        }
    }

    /**
     * Check consistency across components
     */
    private checkConsistency(components: ComponentSpec[], feedback: DesignFeedback): void {
        // Check button sizes
        const buttons = components.filter(c => c.name === "Button");
        const buttonSizes = buttons.map(b => (b.props as Record<string, unknown>).size);
        const uniqueSizes = new Set(buttonSizes.filter(s => s !== undefined));

        if (uniqueSizes.size > 2) {
            feedback.issues.push({
                type: "consistency",
                severity: "warning",
                message: "Too many different button sizes (use max 2 for consistency)",
            });
        }

        // Check card variants
        const cards = components.filter(c => c.name === "Card");
        const cardVariants = cards.map(c => (c.props as Record<string, unknown>).variant);
        const uniqueVariants = new Set(cardVariants.filter(v => v !== undefined));

        if (uniqueVariants.size > 2) {
            feedback.issues.push({
                type: "consistency",
                severity: "suggestion",
                message: "Consider using fewer card variants for visual consistency",
            });
        }
    }

    /**
     * Calculate the final design score
     */
    private calculateScore(feedback: DesignFeedback): number {
        let score = 100;

        feedback.issues.forEach(issue => {
            switch (issue.severity) {
                case "error":
                    score -= 20;
                    break;
                case "warning":
                    score -= 10;
                    break;
                case "suggestion":
                    score -= 5;
                    break;
            }
        });

        // Bonus for improvements available (shows room for enhancement)
        if (feedback.improvements.length > 0 && feedback.improvements.length <= 3) {
            score = Math.min(100, score + 5);
        }

        return Math.max(0, score);
    }

    /**
     * Apply improvements to the UI specification
     */
    private applyImprovements(uiSpec: UISpec, feedback: DesignFeedback): UISpec {
        // Clone the UI spec
        const improved: UISpec = JSON.parse(JSON.stringify(uiSpec));

        // Apply automatic improvements for high-confidence suggestions
        feedback.improvements.forEach(improvement => {
            if (improvement.proposedProps && improvement.componentIndex !== undefined) {
                const component = improved.components[improvement.componentIndex];
                if (component) {
                    component.props = {
                        ...component.props,
                        ...improvement.proposedProps,
                    };
                }
            }
        });

        return improved;
    }
}

export function createDesignCriticAgent(): DesignCriticAgent {
    return new DesignCriticAgent();
}
