/**
 * Agent Types and Interfaces
 * ==========================
 * Type definitions for the multi-agent system.
 */

import { z } from "zod";

/**
 * Component Specification
 */
export const componentSpecSchema = z.object({
    name: z.string(),
    props: z.record(z.unknown()),
    children: z.array(z.any()).optional(),
    metadata: z.object({
        reason: z.string().optional(),
        alternatives: z.array(z.string()).optional(),
    }).optional(),
});

export type ComponentSpec = z.infer<typeof componentSpecSchema>;

/**
 * UI Specification (Component Tree)
 */
export const uiSpecSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    components: z.array(componentSpecSchema),
    layout: z.object({
        type: z.enum(["stack", "grid", "flex", "custom"]).optional(),
        spacing: z.string().optional(),
        maxWidth: z.string().optional(),
    }).optional(),
    metadata: z.object({
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        version: z.number().optional(),
    }).optional(),
});

export type UISpec = z.infer<typeof uiSpecSchema>;

/**
 * Agent Action Types
 */
export type AgentActionType =
    | "CREATE_UI"
    | "MODIFY_UI"
    | "VALIDATE_DESIGN"
    | "VALIDATE_ACCESSIBILITY"
    | "EXPORT_CODE"
    | "ANALYZE_REQUEST";

/**
 * Agent Message
 */
export interface AgentMessage {
    id: string;
    from: AgentRole;
    to: AgentRole;
    action: AgentActionType;
    payload: unknown;
    timestamp: string;
}

/**
 * Agent Roles
 */
export type AgentRole =
    | "orchestrator"
    | "ui-architect"
    | "design-critic"
    | "accessibility"
    | "export-engineer"
    | "user";

/**
 * Agent Response
 */
export interface AgentResponse {
    success: boolean;
    data?: unknown;
    errors?: Array<{
        code: string;
        message: string;
        severity: "error" | "warning" | "info";
    }>;
    suggestions?: string[];
    nextAgent?: AgentRole;
}

/**
 * Design Feedback
 */
export interface DesignFeedback {
    score: number;
    issues: Array<{
        type: "spacing" | "hierarchy" | "contrast" | "alignment" | "consistency";
        severity: "error" | "warning" | "suggestion";
        message: string;
        fix?: ComponentSpec;
    }>;
    improvements: Array<{
        componentIndex: number;
        suggestion: string;
        proposedProps?: Record<string, unknown>;
    }>;
}

/**
 * Accessibility Report
 */
export interface AccessibilityReport {
    passed: boolean;
    score: number;
    violations: Array<{
        rule: string;
        impact: "critical" | "serious" | "moderate" | "minor";
        description: string;
        fix: string;
        componentIndex?: number;
    }>;
    warnings: Array<{
        rule: string;
        description: string;
        recommendation: string;
    }>;
}

/**
 * Export Package
 */
export interface ExportPackage {
    format: "react" | "json" | "html" | "storybook";
    files: Array<{
        name: string;
        content: string;
        type: "component" | "style" | "config";
    }>;
    instructions: string;
}

/**
 * Agent Context
 */
export interface AgentContext {
    conversationId: string;
    currentUI?: UISpec;
    history: AgentMessage[];
    userPreferences?: {
        style?: "modern" | "classic" | "minimal";
        colorScheme?: "light" | "dark" | "auto";
        accessibility?: "standard" | "enhanced";
    };
}

/**
 * Agent Configuration
 */
export interface AgentConfig {
    name: string;
    role: AgentRole;
    systemPrompt: string;
    tools: string[];
    temperature?: number;
    maxTokens?: number;
}

/**
 * Orchestration Plan
 */
export interface OrchestrationPlan {
    id: string;
    steps: Array<{
        order: number;
        agent: AgentRole;
        action: AgentActionType;
        dependsOn?: number[];
        required: boolean;
    }>;
    estimatedDuration: number; // milliseconds
}
