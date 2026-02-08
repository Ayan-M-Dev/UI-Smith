/**
 * Agent Orchestrator
 * ==================
 * Coordinates the multi-agent pipeline for UI generation.
 * 
 * Flow:
 * 1. User Request → UI Architect (creates/modifies UI spec)
 * 2. UI Spec → Design Critic (reviews and improves)
 * 3. Improved UI → Accessibility Agent (validates a11y)
 * 4. Validated UI → Export Engineer (generates code)
 */

import { v4 as uuidv4 } from "uuid";
import {
    AgentContext,
    AgentMessage,
    AgentResponse,
    AgentRole,
    OrchestrationPlan,
    UISpec,
} from "./types";
import { createUIArchitectAgent } from "./ui-architect";
import { createDesignCriticAgent } from "./design-critic";
import { createAccessibilityAgent } from "./accessibility-agent";
import { createExportEngineerAgent, ExportOptions } from "./export-engineer";

/**
 * Pipeline result containing all outputs from the orchestration
 */
export interface PipelineResult {
    conversationId: string;
    success: boolean;
    uiSpec?: UISpec;
    designFeedback?: {
        score: number;
        issues: unknown[];
        improvements: unknown[];
    };
    accessibilityReport?: {
        passed: boolean;
        score: number;
        violations: unknown[];
        warnings: unknown[];
    };
    exportPackage?: {
        format: string;
        files: Array<{ name: string; content: string; type: string }>;
        instructions: string;
    };
    errors: Array<{
        agent: AgentRole;
        code: string;
        message: string;
    }>;
    messages: AgentMessage[];
}

/**
 * Orchestrator options
 */
export interface OrchestratorOptions {
    autoApplyDesignImprovements: boolean;
    autoApplyAccessibilityFixes: boolean;
    skipDesignReview: boolean;
    skipAccessibilityCheck: boolean;
    exportOnSuccess: boolean;
    exportOptions?: Partial<ExportOptions>;
}

const defaultOptions: OrchestratorOptions = {
    autoApplyDesignImprovements: true,
    autoApplyAccessibilityFixes: true,
    skipDesignReview: false,
    skipAccessibilityCheck: false,
    exportOnSuccess: true,
    exportOptions: {
        format: "full",
        typescript: true,
        framework: "nextjs",
    },
};

/**
 * Agent Orchestrator Class
 */
export class AgentOrchestrator {
    private context: AgentContext;
    private options: OrchestratorOptions;
    private messages: AgentMessage[] = [];

    constructor(options?: Partial<OrchestratorOptions>) {
        this.options = { ...defaultOptions, ...options };
        this.context = {
            conversationId: uuidv4(),
            history: [],
        };
    }

    /**
     * Process a user request through the agent pipeline
     */
    async processRequest(userMessage: string): Promise<PipelineResult> {
        this.logMessage("user", "orchestrator", "ANALYZE_REQUEST", { message: userMessage });

        const result: PipelineResult = {
            conversationId: this.context.conversationId,
            success: false,
            errors: [],
            messages: [],
        };

        try {
            // Step 1: UI Architect - Create/Modify UI
            const uiArchitect = createUIArchitectAgent(this.context);
            this.logMessage("orchestrator", "ui-architect", "CREATE_UI", { userMessage });

            const architectResponse = await uiArchitect.processRequest(userMessage);

            if (!architectResponse.success || !architectResponse.data) {
                result.errors.push({
                    agent: "ui-architect",
                    code: architectResponse.errors?.[0]?.code || "UNKNOWN",
                    message: architectResponse.errors?.[0]?.message || "Failed to create UI",
                });
                result.messages = this.messages;
                return result;
            }

            let currentUI = architectResponse.data as UISpec;
            result.uiSpec = currentUI;
            this.context.currentUI = currentUI;

            // Step 2: Design Critic - Review and Improve (optional)
            if (!this.options.skipDesignReview) {
                const designCritic = createDesignCriticAgent();
                this.logMessage("orchestrator", "design-critic", "VALIDATE_DESIGN", { uiSpec: currentUI });

                const criticResponse = await designCritic.review(currentUI);

                if (criticResponse.data) {
                    const criticData = criticResponse.data as { feedback: unknown; improvedUI?: UISpec };
                    result.designFeedback = criticData.feedback as PipelineResult["designFeedback"];

                    if (this.options.autoApplyDesignImprovements && criticData.improvedUI) {
                        currentUI = criticData.improvedUI;
                        result.uiSpec = currentUI;
                        this.context.currentUI = currentUI;
                    }
                }

                if (!criticResponse.success) {
                    result.errors.push({
                        agent: "design-critic",
                        code: criticResponse.errors?.[0]?.code || "DESIGN_ISSUES",
                        message: criticResponse.errors?.[0]?.message || "Design review found issues",
                    });
                    // Continue anyway, design issues are not blocking
                }
            }

            // Step 3: Accessibility Agent - Validate A11y (optional)
            if (!this.options.skipAccessibilityCheck) {
                const a11yAgent = createAccessibilityAgent();
                this.logMessage("orchestrator", "accessibility", "VALIDATE_ACCESSIBILITY", { uiSpec: currentUI });

                const a11yResponse = await a11yAgent.validate(currentUI);

                if (a11yResponse.data) {
                    const a11yData = a11yResponse.data as { report: unknown; fixedUI?: UISpec };
                    result.accessibilityReport = a11yData.report as PipelineResult["accessibilityReport"];

                    if (this.options.autoApplyAccessibilityFixes && a11yData.fixedUI) {
                        currentUI = a11yData.fixedUI;
                        result.uiSpec = currentUI;
                        this.context.currentUI = currentUI;
                    }
                }

                if (!a11yResponse.success) {
                    result.errors.push({
                        agent: "accessibility",
                        code: a11yResponse.errors?.[0]?.code || "A11Y_ISSUES",
                        message: a11yResponse.errors?.[0]?.message || "Accessibility validation found issues",
                    });
                    // Don't continue if critical a11y issues
                    if (result.accessibilityReport && !result.accessibilityReport.passed) {
                        result.messages = this.messages;
                        return result;
                    }
                }
            }

            // Step 4: Export Engineer - Generate Code
            if (this.options.exportOnSuccess) {
                const exportEngineer = createExportEngineerAgent();
                this.logMessage("orchestrator", "export-engineer", "EXPORT_CODE", { uiSpec: currentUI });

                const exportResponse = await exportEngineer.export(currentUI, this.options.exportOptions);

                if (exportResponse.success && exportResponse.data) {
                    result.exportPackage = exportResponse.data as PipelineResult["exportPackage"];
                } else {
                    result.errors.push({
                        agent: "export-engineer",
                        code: exportResponse.errors?.[0]?.code || "EXPORT_FAILED",
                        message: exportResponse.errors?.[0]?.message || "Failed to export code",
                    });
                }
            }

            // Mark as successful if we have a UI spec and no critical errors
            result.success = !!result.uiSpec && result.errors.filter(e =>
                e.agent === "accessibility" && e.code.startsWith("A11Y_")
            ).length === 0;

            result.messages = this.messages;
            return result;

        } catch (error) {
            result.errors.push({
                agent: "orchestrator",
                code: "ORCHESTRATION_ERROR",
                message: String(error),
            });
            result.messages = this.messages;
            return result;
        }
    }

    /**
     * Continue with a modification request
     */
    async modifyUI(modificationRequest: string): Promise<PipelineResult> {
        if (!this.context.currentUI) {
            return {
                conversationId: this.context.conversationId,
                success: false,
                errors: [{
                    agent: "orchestrator",
                    code: "NO_UI",
                    message: "No existing UI to modify. Use processRequest() first.",
                }],
                messages: this.messages,
            };
        }

        return this.processRequest(modificationRequest);
    }

    /**
     * Get the current UI specification
     */
    getCurrentUI(): UISpec | undefined {
        return this.context.currentUI;
    }

    /**
     * Get the conversation context
     */
    getContext(): AgentContext {
        return this.context;
    }

    /**
     * Create an orchestration plan for visualization
     */
    createPlan(userMessage: string): OrchestrationPlan {
        const steps: OrchestrationPlan["steps"] = [];
        let order = 1;

        // Step 1: UI Architect
        steps.push({
            order: order++,
            agent: "ui-architect",
            action: this.context.currentUI ? "MODIFY_UI" : "CREATE_UI",
            required: true,
        });

        // Step 2: Design Critic
        if (!this.options.skipDesignReview) {
            steps.push({
                order: order++,
                agent: "design-critic",
                action: "VALIDATE_DESIGN",
                dependsOn: [1],
                required: false,
            });
        }

        // Step 3: Accessibility
        if (!this.options.skipAccessibilityCheck) {
            steps.push({
                order: order++,
                agent: "accessibility",
                action: "VALIDATE_ACCESSIBILITY",
                dependsOn: this.options.skipDesignReview ? [1] : [2],
                required: true,
            });
        }

        // Step 4: Export
        if (this.options.exportOnSuccess) {
            steps.push({
                order: order++,
                agent: "export-engineer",
                action: "EXPORT_CODE",
                dependsOn: [order - 2],
                required: false,
            });
        }

        return {
            id: uuidv4(),
            steps,
            estimatedDuration: steps.length * 1000, // Rough estimate: 1s per step
        };
    }

    /**
     * Reset the conversation context
     */
    reset(): void {
        this.context = {
            conversationId: uuidv4(),
            history: [],
        };
        this.messages = [];
    }

    /**
     * Log a message between agents
     */
    private logMessage(
        from: AgentRole,
        to: AgentRole,
        action: AgentMessage["action"],
        payload: unknown
    ): void {
        const message: AgentMessage = {
            id: uuidv4(),
            from,
            to,
            action,
            payload,
            timestamp: new Date().toISOString(),
        };
        this.messages.push(message);
        this.context.history.push(message);
    }
}

/**
 * Create a new orchestrator instance
 */
export function createOrchestrator(options?: Partial<OrchestratorOptions>): AgentOrchestrator {
    return new AgentOrchestrator(options);
}

/**
 * Simple function to process a UI request
 */
export async function generateUI(
    userMessage: string,
    options?: Partial<OrchestratorOptions>
): Promise<PipelineResult> {
    const orchestrator = createOrchestrator(options);
    return orchestrator.processRequest(userMessage);
}
