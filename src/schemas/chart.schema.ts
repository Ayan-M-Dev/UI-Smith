import { z } from "zod";
import { colorSchema, basePropsSchema } from "./common.schema";

/**
 * Chart Schema
 * ============
 * Defines props for data visualization charts using Recharts.
 */

// Individual data point
export const chartDataPointSchema = z.object({
    name: z.string().describe("Label for the data point (x-axis)"),
    value: z.number().describe("Primary value"),
    value2: z.number().optional().describe("Secondary value for comparison charts"),
    value3: z.number().optional().describe("Tertiary value"),
    category: z.string().optional().describe("Category for grouping"),
    color: z.string().optional().describe("Custom color for this data point"),
});

// Chart series for multi-line/bar charts
export const chartSeriesSchema = z.object({
    id: z.string(),
    name: z.string().describe("Series name for legend"),
    dataKey: z.string().describe("Key in data to use for values"),
    color: z.string().optional().describe("Color for this series"),
    type: z.enum(["line", "bar", "area"]).optional().describe("Visual type for this series"),
});

export const chartPropsSchema = basePropsSchema.extend({
    // Data
    data: z.array(chartDataPointSchema)
        .min(1)
        .describe("Array of data points to display"),

    // Chart type
    type: z.enum([
        "line",
        "bar",
        "area",
        "pie",
        "donut",
        "scatter",
        "composed",  // Mixed chart types
    ]).describe("Type of chart to render"),

    // For multi-series charts
    series: z.array(chartSeriesSchema)
        .optional()
        .describe("Multiple data series for comparison"),

    // Dimensions
    height: z.number().optional().default(300).describe("Chart height in pixels"),
    aspectRatio: z.number().optional().describe("Aspect ratio (width/height)"),

    // Title & Labels
    title: z.string().optional().describe("Chart title"),
    subtitle: z.string().optional().describe("Subtitle below title"),
    xAxisLabel: z.string().optional().describe("Label for X axis"),
    yAxisLabel: z.string().optional().describe("Label for Y axis"),

    // Legend
    showLegend: z.boolean().optional().default(true),
    legendPosition: z.enum(["top", "bottom", "left", "right"]).optional().default("bottom"),

    // Grid
    showGrid: z.boolean().optional().default(true),
    gridStyle: z.enum(["solid", "dashed", "dotted"]).optional().default("dashed"),

    // Axes
    showXAxis: z.boolean().optional().default(true),
    showYAxis: z.boolean().optional().default(true),

    // Interactivity
    showTooltip: z.boolean().optional().default(true),
    animated: z.boolean().optional().default(true),

    // Colors
    colorScheme: z.enum([
        "default",
        "warm",
        "cool",
        "monochrome",
        "vibrant",
        "pastel",
    ]).optional().default("default"),

    colors: z.array(z.string())
        .optional()
        .describe("Custom color array for data points/series"),

    // Specific chart options
    stacked: z.boolean()
        .optional()
        .default(false)
        .describe("Whether to stack bars/areas"),

    curved: z.boolean()
        .optional()
        .default(true)
        .describe("Whether to use curved lines (for line/area charts)"),

    // Pie/Donut specific
    innerRadius: z.number()
        .optional()
        .describe("Inner radius for donut charts (0-1 ratio)"),

    showLabels: z.boolean()
        .optional()
        .default(true)
        .describe("Show value labels on pie/donut slices"),

    // Reference lines
    referenceLines: z.array(z.object({
        value: z.number(),
        label: z.string().optional(),
        color: z.string().optional(),
        axis: z.enum(["x", "y"]).optional().default("y"),
    })).optional().describe("Reference/threshold lines"),
});

export type ChartDataPoint = z.infer<typeof chartDataPointSchema>;
export type ChartSeries = z.infer<typeof chartSeriesSchema>;
export type ChartProps = z.infer<typeof chartPropsSchema>;
