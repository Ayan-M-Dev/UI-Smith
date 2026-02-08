import { z } from "zod";
import { sizeSchema, iconNameSchema, basePropsSchema } from "./common.schema";

/**
 * Form Schema
 * ===========
 * Defines props for dynamic form generation with various field types.
 */

// Validation rules for form fields
export const validationRuleSchema = z.object({
    type: z.enum([
        "required",
        "email",
        "url",
        "minLength",
        "maxLength",
        "min",
        "max",
        "pattern",
        "custom",
    ]).describe("Type of validation rule"),
    value: z.union([z.string(), z.number()]).optional().describe("Value for the rule"),
    message: z.string().describe("Error message to display"),
});

// Individual form field
export const formFieldSchema = z.object({
    id: z.string().describe("Unique identifier for the field"),
    name: z.string().describe("Field name for form data"),
    label: z.string().describe("Display label"),
    placeholder: z.string().optional().describe("Placeholder text"),
    helpText: z.string().optional().describe("Helper text below the field"),

    // Field type
    type: z.enum([
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "textarea",
        "select",
        "multiselect",
        "checkbox",
        "radio",
        "switch",
        "date",
        "time",
        "datetime",
        "file",
        "color",
        "range",
        "hidden",
    ]).describe("Input field type"),

    // For select/radio/checkbox groups
    options: z.array(z.object({
        value: z.string(),
        label: z.string(),
        disabled: z.boolean().optional(),
    })).optional().describe("Options for select, radio, or checkbox group"),

    // Default value
    defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
        .optional()
        .describe("Default value for the field"),

    // States
    disabled: z.boolean().optional().default(false),
    readOnly: z.boolean().optional().default(false),
    required: z.boolean().optional().default(false),

    // Validation
    validation: z.array(validationRuleSchema).optional(),

    // Layout
    width: z.enum(["full", "half", "third", "quarter"]).optional().default("full"),

    // Visual
    icon: iconNameSchema.optional().describe("Icon to display in the field"),
    iconPosition: z.enum(["left", "right"]).optional().default("left"),

    // Conditional display
    showWhen: z.object({
        fieldId: z.string(),
        operator: z.enum(["equals", "notEquals", "contains", "greaterThan", "lessThan"]),
        value: z.union([z.string(), z.number(), z.boolean()]),
    }).optional().describe("Condition for showing this field"),
});

// Form section for grouping fields
export const formSectionSchema = z.object({
    id: z.string(),
    title: z.string().optional().describe("Section title"),
    description: z.string().optional().describe("Section description"),
    fields: z.array(formFieldSchema).min(1),
    collapsible: z.boolean().optional().default(false),
    defaultExpanded: z.boolean().optional().default(true),
});

export const formPropsSchema = basePropsSchema.extend({
    // Title
    title: z.string().optional().describe("Form title"),
    description: z.string().optional().describe("Form description or instructions"),

    // Structure
    sections: z.array(formSectionSchema)
        .optional()
        .describe("Form sections for grouping fields"),

    fields: z.array(formFieldSchema)
        .optional()
        .describe("Form fields (use if no sections)"),

    // Layout
    layout: z.enum(["vertical", "horizontal", "inline"])
        .optional()
        .default("vertical"),

    labelPosition: z.enum(["top", "left", "floating"])
        .optional()
        .default("top"),

    size: sizeSchema.optional().default("md"),

    // Submit
    submitText: z.string().optional().default("Submit"),
    showSubmitButton: z.boolean().optional().default(true),
    submitPosition: z.enum(["left", "center", "right", "full"])
        .optional()
        .default("right"),

    // Cancel
    showCancelButton: z.boolean().optional().default(false),
    cancelText: z.string().optional().default("Cancel"),

    // States
    loading: z.boolean().optional().default(false),
    disabled: z.boolean().optional().default(false),

    // Behavior
    autoFocus: z.boolean().optional().default(true),
    showValidationOnBlur: z.boolean().optional().default(true),
    showValidationOnChange: z.boolean().optional().default(false),

    // Progress (for multi-step)
    showProgress: z.boolean().optional().default(false),
    currentStep: z.number().optional(),
    totalSteps: z.number().optional(),
});

export type ValidationRule = z.infer<typeof validationRuleSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
export type FormSection = z.infer<typeof formSectionSchema>;
export type FormProps = z.infer<typeof formPropsSchema>;
