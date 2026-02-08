/**
 * Accessibility Agent
 * ===================
 * Validates UI for WCAG compliance and accessibility.
 * 
 * Responsibilities:
 * - Check color contrast ratios
 * - Validate ARIA labels and roles
 * - Ensure keyboard navigability
 * - Verify heading hierarchy
 * - Generate accessibility reports
 * 
 * Tools Access:
 * - Accessibility MCP: check_color_contrast, check_aria_labels, check_keyboard_navigation
 */

import { AgentConfig, AgentResponse, UISpec, AccessibilityReport, ComponentSpec } from "./types";

export const accessibilityAgentConfig: AgentConfig = {
    name: "Accessibility Agent",
    role: "accessibility",
    systemPrompt: `You are the Accessibility Agent for UI-Smith. Your role is to ensure all generated UIs meet WCAG 2.1 AA standards and follow accessibility best practices.

## Your Focus Areas
1. **Color Contrast** - Minimum 4.5:1 for normal text, 3:1 for large text
2. **ARIA Labels** - All interactive elements must have accessible names
3. **Keyboard Navigation** - All functionality must be keyboard accessible
4. **Heading Structure** - Proper heading hierarchy (h1 > h2 > h3)
5. **Focus Management** - Visible focus indicators on all interactive elements

## Validation Rules
- CRITICAL: Missing ARIA labels on interactive elements
- CRITICAL: Contrast ratio below 4.5:1 for body text
- SERIOUS: Missing form labels
- SERIOUS: Improper heading order
- MODERATE: Missing alt text on images
- MINOR: Redundant ARIA attributes

## Output Format
Return an AccessibilityReport with:
- passed: boolean indicating if critical issues exist
- score: accessibility score (0-100)
- violations: array of accessibility violations
- warnings: array of potential issues

Always prioritize fixing CRITICAL and SERIOUS issues before passing to the next agent.
`,
    tools: [
        "a11y:check_color_contrast",
        "a11y:check_aria_labels",
        "a11y:check_keyboard_navigation",
        "a11y:check_heading_structure",
        "a11y:get_accessibility_report",
    ],
    temperature: 0.3,
    maxTokens: 2000,
};

/**
 * Accessibility Agent Class
 */
export class AccessibilityAgent {
    /**
     * Validate a UI specification for accessibility
     */
    async validate(uiSpec: UISpec): Promise<AgentResponse> {
        try {
            const report = await this.runAccessibilityChecks(uiSpec);

            // Auto-fix what we can
            const fixedUI = this.applyAccessibilityFixes(uiSpec, report);

            // If there are still critical violations, return failure
            const criticalViolations = report.violations.filter(v => v.impact === "critical");

            if (criticalViolations.length > 0) {
                return {
                    success: false,
                    data: { report, fixedUI },
                    errors: criticalViolations.map(v => ({
                        code: `A11Y_${v.rule.toUpperCase()}`,
                        message: v.description,
                        severity: "error" as const,
                    })),
                    suggestions: criticalViolations.map(v => v.fix),
                };
            }

            return {
                success: true,
                data: { report, fixedUI },
                nextAgent: "export-engineer",
            };
        } catch (error) {
            return {
                success: false,
                errors: [{
                    code: "VALIDATION_ERROR",
                    message: String(error),
                    severity: "error",
                }],
            };
        }
    }

    /**
     * Run all accessibility checks
     */
    private async runAccessibilityChecks(uiSpec: UISpec): Promise<AccessibilityReport> {
        const report: AccessibilityReport = {
            passed: true,
            score: 100,
            violations: [],
            warnings: [],
        };

        // Check each component
        uiSpec.components.forEach((component, index) => {
            this.checkComponentAccessibility(component, index, report);
        });

        // Check overall page structure
        this.checkPageStructure(uiSpec, report);

        // Calculate final score
        report.score = this.calculateA11yScore(report);
        report.passed = report.violations.filter(v => v.impact === "critical").length === 0;

        return report;
    }

    /**
     * Check individual component accessibility
     */
    private checkComponentAccessibility(
        component: ComponentSpec,
        index: number,
        report: AccessibilityReport
    ): void {
        const props = component.props as Record<string, unknown>;

        // Check Button accessibility
        if (component.name === "Button") {
            // Icon-only buttons need aria-label
            if (props.iconOnly && !props.ariaLabel && !props["aria-label"]) {
                report.violations.push({
                    rule: "button-name",
                    impact: "critical",
                    description: `Button at index ${index} is icon-only without accessible name`,
                    fix: "Add ariaLabel prop to the Button component",
                    componentIndex: index,
                });
            }

            // Check text content
            if (!props.iconOnly && !props.text && !props.children) {
                report.violations.push({
                    rule: "button-name",
                    impact: "critical",
                    description: `Button at index ${index} has no text content`,
                    fix: "Add text prop or children to the Button",
                    componentIndex: index,
                });
            }
        }

        // Check Form accessibility
        if (component.name === "Form") {
            const fields = (props.fields || props.sections) as Array<Record<string, unknown>> | undefined;

            if (fields) {
                const flatFields = Array.isArray(fields[0]?.fields)
                    ? fields.flatMap((s: Record<string, unknown>) => (s.fields as Array<Record<string, unknown>>) || [])
                    : fields;

                flatFields.forEach((field: Record<string, unknown>, fieldIndex: number) => {
                    // Check for labels
                    if (!field.label && !field["aria-label"]) {
                        report.violations.push({
                            rule: "form-field-label",
                            impact: "critical",
                            description: `Form field "${field.name}" at index ${fieldIndex} has no label`,
                            fix: `Add label prop to field "${field.name}"`,
                            componentIndex: index,
                        });
                    }

                    // Check required field indication
                    if (field.required && !field.label?.toString().includes("*")) {
                        report.warnings.push({
                            rule: "required-indication",
                            description: `Required field "${field.name}" doesn't visually indicate requirement`,
                            recommendation: "Required fields should be visually indicated (e.g., asterisk)",
                        });
                    }
                });
            }
        }

        // Check Modal accessibility
        if (component.name === "Modal") {
            // Check for accessible name
            if (!props.title && !props["aria-label"] && !props.ariaLabel) {
                report.violations.push({
                    rule: "modal-name",
                    impact: "serious",
                    description: `Modal at index ${index} has no accessible name`,
                    fix: "Add title or aria-label prop to the Modal",
                    componentIndex: index,
                });
            }

            // Check for close mechanism
            if (props.showCloseButton === false && !props.closeOnEscape && !props.closeOnOverlayClick) {
                report.violations.push({
                    rule: "modal-escape",
                    impact: "serious",
                    description: `Modal at index ${index} has no way to close`,
                    fix: "Enable at least one close mechanism: showCloseButton, closeOnEscape, or closeOnOverlayClick",
                    componentIndex: index,
                });
            }
        }

        // Check Card accessibility
        if (component.name === "Card") {
            // Check clickable cards for keyboard accessibility
            if (props.clickable && !props.href && !props.onClick) {
                report.warnings.push({
                    rule: "card-interactive",
                    description: `Clickable card at index ${index} should have clear interactive purpose`,
                    recommendation: "Add href or ensure onClick handles keyboard events",
                });
            }

            // Check images for alt text
            if (props.imageUrl && !props.imageAlt) {
                report.violations.push({
                    rule: "image-alt",
                    impact: "serious",
                    description: `Card image at index ${index} has no alt text`,
                    fix: "Add imageAlt prop with descriptive text",
                    componentIndex: index,
                });
            }
        }

        // Check Chart accessibility
        if (component.name === "Chart") {
            // Charts should have accessible descriptions
            if (!props.title && !props["aria-label"]) {
                report.violations.push({
                    rule: "chart-label",
                    impact: "serious",
                    description: `Chart at index ${index} has no accessible label`,
                    fix: "Add title or aria-label to describe the chart data",
                    componentIndex: index,
                });
            }
        }

        // Check TestimonialSection accessibility
        if (component.name === "TestimonialSection") {
            const testimonials = props.testimonials as Array<Record<string, unknown>> | undefined;

            if (testimonials) {
                testimonials.forEach((testimonial, tIndex) => {
                    // Check for author avatar alt text
                    if (testimonial.authorAvatarUrl && !testimonial.authorName) {
                        report.warnings.push({
                            rule: "image-alt",
                            description: `Testimonial ${tIndex} has avatar without author name for alt text`,
                            recommendation: "Ensure authorName is provided for avatar alt text",
                        });
                    }
                });
            }
        }

        // Check DashboardLayout accessibility
        if (component.name === "DashboardLayout") {
            const sidebar = props.sidebar as Record<string, unknown> | undefined;

            if (sidebar) {
                const navItems = sidebar.navItems as Array<Record<string, unknown>> | undefined;

                if (navItems) {
                    navItems.forEach((item, itemIndex) => {
                        // Check nav items for labels when using icons
                        if (item.icon && !item.label) {
                            report.violations.push({
                                rule: "nav-item-label",
                                impact: "serious",
                                description: `Navigation item ${itemIndex} has icon but no label`,
                                fix: "Add label prop to navigation item",
                                componentIndex: index,
                            });
                        }
                    });
                }
            }
        }
    }

    /**
     * Check overall page structure
     */
    private checkPageStructure(uiSpec: UISpec, report: AccessibilityReport): void {
        // Check for landmark regions
        const hasDashboard = uiSpec.components.some(c => c.name === "DashboardLayout");

        if (!hasDashboard) {
            report.warnings.push({
                rule: "landmark-main",
                description: "Consider using semantic landmarks for page structure",
                recommendation: "Wrap content in main, nav, aside elements as appropriate",
            });
        }

        // Check for heading hierarchy
        // In a real implementation, we'd analyze the actual heading structure
        const hasHeadings = uiSpec.components.some(c => {
            const props = c.props as Record<string, unknown>;
            return props.title || props.headline;
        });

        if (!hasHeadings && uiSpec.components.length > 0) {
            report.warnings.push({
                rule: "heading-structure",
                description: "Page may lack proper heading structure",
                recommendation: "Add headings to organize content hierarchically",
            });
        }
    }

    /**
     * Calculate accessibility score
     */
    private calculateA11yScore(report: AccessibilityReport): number {
        let score = 100;

        report.violations.forEach(violation => {
            switch (violation.impact) {
                case "critical":
                    score -= 25;
                    break;
                case "serious":
                    score -= 15;
                    break;
                case "moderate":
                    score -= 10;
                    break;
                case "minor":
                    score -= 5;
                    break;
            }
        });

        report.warnings.forEach(() => {
            score -= 2;
        });

        return Math.max(0, score);
    }

    /**
     * Apply automatic accessibility fixes
     */
    private applyAccessibilityFixes(uiSpec: UISpec, report: AccessibilityReport): UISpec {
        const fixed: UISpec = JSON.parse(JSON.stringify(uiSpec));

        // Apply fixes for each violation that has a componentIndex
        report.violations.forEach(violation => {
            if (violation.componentIndex === undefined) return;

            const component = fixed.components[violation.componentIndex];
            if (!component) return;

            const props = component.props as Record<string, unknown>;

            // Auto-fix icon-only buttons
            if (violation.rule === "button-name" && props.iconOnly) {
                props.ariaLabel = `${props.icon || "Action"} button`;
            }

            // Auto-fix modal without title
            if (violation.rule === "modal-name" && !props.title) {
                props["aria-label"] = "Dialog";
            }

            // Auto-fix card images without alt
            if (violation.rule === "image-alt" && props.imageUrl) {
                props.imageAlt = String(props.title || "Image");
            }

            // Auto-fix charts without labels
            if (violation.rule === "chart-label") {
                props["aria-label"] = `Chart: ${props.subtitle || "Data visualization"}`;
            }
        });

        return fixed;
    }
}

export function createAccessibilityAgent(): AccessibilityAgent {
    return new AccessibilityAgent();
}
