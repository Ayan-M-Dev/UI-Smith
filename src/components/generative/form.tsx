"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  type FormProps,
  type FormField as FormFieldType,
  formPropsSchema,
} from "@/schemas/form.schema";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Loader2, Eye, EyeOff } from "lucide-react";

/**
 * Form Component
 * ==============
 * Dynamic form generation with various field types and validation.
 */

// Get Lucide icon by name
function getIcon(name: string | undefined): React.ElementType | null {
  if (!name) return null;
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return ((LucideIcons as any) as Record<string, React.ElementType>)[pascalName] || null;
}

// Size classes for form elements
const sizeClasses = {
  xs: "h-7 text-xs px-2",
  sm: "h-8 text-sm px-3",
  md: "h-10 text-sm px-3",
  lg: "h-11 text-base px-4",
  xl: "h-12 text-lg px-4",
  "2xl": "h-14 text-xl px-5",
};

// Width classes
const widthClasses = {
  full: "col-span-full",
  half: "col-span-1 md:col-span-1",
  third: "col-span-1 md:col-span-1 lg:col-span-1",
  quarter: "col-span-1",
};

// Individual Form Field Component
function FormField({
  field,
  size,
  labelPosition,
  showValidationOnBlur,
  showValidationOnChange,
  formValues,
  setFormValue,
}: {
  field: FormFieldType;
  size: string;
  labelPosition: string;
  showValidationOnBlur: boolean;
  showValidationOnChange: boolean;
  formValues: Record<string, any>;
  setFormValue: (name: string, value: any) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Icon = getIcon(field.icon);
  const value = formValues[field.name] ?? field.defaultValue ?? "";

  // Simple validation
  const validate = useCallback(() => {
    if (!field.validation) return null;
    
    for (const rule of field.validation) {
      switch (rule.type) {
        case "required":
          if (!value || (typeof value === "string" && !value.trim())) {
            return rule.message;
          }
          break;
        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message;
          }
          break;
        case "minLength":
          if (value && String(value).length < (rule.value as number)) {
            return rule.message;
          }
          break;
        case "maxLength":
          if (value && String(value).length > (rule.value as number)) {
            return rule.message;
          }
          break;
      }
    }
    return null;
  }, [field.validation, value]);

  const handleBlur = () => {
    setTouched(true);
    if (showValidationOnBlur) {
      setError(validate());
    }
  };

  const handleChange = (newValue: any) => {
    setFormValue(field.name, newValue);
    if (showValidationOnChange && touched) {
      setError(validate());
    }
  };

  const baseInputClasses = cn(
    "w-full bg-white dark:bg-slate-800 border rounded-lg transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500",
    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
    "text-slate-900 dark:text-white",
    sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md,
    error
      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
      : "border-slate-200 dark:border-slate-700",
    field.disabled && "opacity-50 cursor-not-allowed",
    Icon && field.iconPosition !== "right" && "pl-10",
    Icon && field.iconPosition === "right" && "pr-10"
  );

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            rows={4}
            className={cn(
              baseInputClasses,
              "h-auto py-2 resize-y min-h-[100px]"
            )}
          />
        );

      case "select":
        return (
          <select
            id={field.id}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={field.disabled}
            className={cn(baseInputClasses, "appearance-none cursor-pointer")}
          >
            <option value="">{field.placeholder || "Select..."}</option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              checked={!!value}
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
              disabled={field.disabled}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <label
              htmlFor={field.id}
              className="text-sm text-slate-700 dark:text-slate-300"
            >
              {field.label}
            </label>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  disabled={field.disabled || option.disabled}
                  className="w-4 h-4 border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm text-slate-700 dark:text-slate-300"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "switch":
        return (
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => !field.disabled && handleChange(!value)}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors",
              value ? "bg-violet-600" : "bg-slate-200 dark:bg-slate-700",
              field.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                value ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        );

      case "range":
        return (
          <input
            type="range"
            id={field.id}
            name={field.name}
            value={value || 50}
            onChange={(e) => handleChange(Number(e.target.value))}
            disabled={field.disabled}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />
        );

      case "color":
        return (
          <input
            type="color"
            id={field.id}
            name={field.name}
            value={value || "#8b5cf6"}
            onChange={(e) => handleChange(e.target.value)}
            disabled={field.disabled}
            className="w-12 h-10 rounded-lg cursor-pointer"
          />
        );

      case "password":
        return (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id={field.id}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={cn(baseInputClasses, "pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        );

      default:
        return (
          <div className="relative">
            {Icon && field.iconPosition !== "right" && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            )}
            <input
              type={field.type}
              id={field.id}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              disabled={field.disabled}
              readOnly={field.readOnly}
              className={baseInputClasses}
            />
            {Icon && field.iconPosition === "right" && (
              <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            )}
          </div>
        );
    }
  };

  // Don't render label separately for checkbox (it's inline)
  if (field.type === "checkbox") {
    return (
      <div className={cn(widthClasses[field.width || "full"])}>
        {renderInput()}
        {field.helpText && (
          <p className="mt-1 text-xs text-slate-500">{field.helpText}</p>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        widthClasses[field.width || "full"],
        labelPosition === "horizontal" && "flex items-start gap-4"
      )}
    >
      {/* Label */}
      {labelPosition !== "floating" && (
        <label
          htmlFor={field.id}
          className={cn(
            "block text-sm font-medium text-slate-700 dark:text-slate-300",
            labelPosition === "horizontal" ? "w-1/3 pt-2" : "mb-1.5"
          )}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className={cn(labelPosition === "horizontal" && "flex-1")}>
        {renderInput()}
        
        {/* Help text */}
        {field.helpText && (
          <p className="mt-1 text-xs text-slate-500">{field.helpText}</p>
        )}
        
        {/* Error */}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export function Form(props: FormProps) {
  const validatedProps = formPropsSchema.parse(props);

  const {
    title,
    description,
    sections,
    fields,
    layout = "vertical",
    labelPosition = "top",
    size = "md",
    submitText = "Submit",
    showSubmitButton = true,
    submitPosition = "right",
    showCancelButton = false,
    cancelText = "Cancel",
    loading = false,
    disabled = false,
    autoFocus = true,
    showValidationOnBlur = true,
    showValidationOnChange = false,
    showProgress = false,
    currentStep,
    totalSteps,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const setFormValue = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
    // In a real app, this would trigger an action
  };

  // Get all fields (from sections or direct fields prop)
  const allFields = sections
    ? sections.flatMap((section) => section.fields)
    : fields || [];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6",
        className
      )}
      id={id}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Progress indicator */}
      {showProgress && currentStep && totalSteps && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      {sections ? (
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id}>
              {/* Section header */}
              {(section.title || section.description) && (
                <div className="mb-4">
                  {section.title && (
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      {section.title}
                    </h3>
                  )}
                  {section.description && (
                    <p className="mt-0.5 text-sm text-slate-500">
                      {section.description}
                    </p>
                  )}
                </div>
              )}

              {/* Section fields */}
              <div
                className={cn(
                  "grid gap-4",
                  layout === "inline" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
                )}
              >
                {section.fields.map((field) => (
                  <FormField
                    key={field.id}
                    field={field}
                    size={size}
                    labelPosition={labelPosition}
                    showValidationOnBlur={showValidationOnBlur}
                    showValidationOnChange={showValidationOnChange}
                    formValues={formValues}
                    setFormValue={setFormValue}
                  />
                ))}
              </div>

              {/* Section divider */}
              {index < sections.length - 1 && (
                <hr className="mt-8 border-slate-200 dark:border-slate-700" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            layout === "inline" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
          )}
        >
          {allFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              size={size}
              labelPosition={labelPosition}
              showValidationOnBlur={showValidationOnBlur}
              showValidationOnChange={showValidationOnChange}
              formValues={formValues}
              setFormValue={setFormValue}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {(showSubmitButton || showCancelButton) && (
        <div
          className={cn(
            "flex gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700",
            submitPosition === "left" && "justify-start",
            submitPosition === "center" && "justify-center",
            submitPosition === "right" && "justify-end",
            submitPosition === "full" && "flex-col sm:flex-row"
          )}
        >
          {showCancelButton && (
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                submitPosition === "full" && "flex-1"
              )}
            >
              {cancelText}
            </button>
          )}
          {showSubmitButton && (
            <button
              type="submit"
              disabled={loading || disabled}
              className={cn(
                "px-6 py-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                submitPosition === "full" && "flex-1"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                submitText
              )}
            </button>
          )}
        </div>
      )}
    </motion.form>
  );
}

Form.displayName = "Form";
