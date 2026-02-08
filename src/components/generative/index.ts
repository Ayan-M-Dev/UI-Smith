/**
 * UI-Smith Components
 * ===================
 * Central export for all generative UI components.
 * These components are registered with Tambo for AI rendering.
 */

export { Button } from "./button";
export { Card } from "./card";
export { PricingTable } from "./pricing-table";
export { DashboardLayout } from "./dashboard-layout";
export { Chart } from "./chart";
export { Form } from "./form";
export { Modal } from "./modal";
export { TestimonialSection } from "./testimonial-section";

// Re-export types
export type { ButtonProps } from "@/schemas/button.schema";
export type { CardProps } from "@/schemas/card.schema";
export type { PricingTableProps } from "@/schemas/pricing-table.schema";
export type { DashboardLayoutProps } from "@/schemas/dashboard-layout.schema";
export type { ChartProps } from "@/schemas/chart.schema";
export type { FormProps } from "@/schemas/form.schema";
export type { ModalProps } from "@/schemas/modal.schema";
export type { TestimonialSectionProps } from "@/schemas/testimonial-section.schema";
