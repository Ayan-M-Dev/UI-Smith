"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type ChartProps, chartPropsSchema } from "@/schemas/chart.schema";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/**
 * Chart Component
 * ===============
 * Versatile chart component supporting multiple chart types using Recharts.
 */

// Color schemes
const colorSchemes: Record<string, string[]> = {
  default: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"],
  warm: ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e"],
  cool: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"],
  monochrome: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1"],
  vibrant: ["#f43f5e", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"],
  pastel: ["#c4b5fd", "#a5f3fc", "#a7f3d0", "#fde68a", "#fca5a5", "#fbcfe8"],
};

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <p className="font-medium text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p
          key={index}
          className="text-sm"
          style={{ color: entry.color || entry.stroke }}
        >
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

// Grid style mapping
const gridStyles: Record<string, string> = {
  solid: "",
  dashed: "3 3",
  dotted: "1 3",
};

export function Chart(props: ChartProps) {
  const validatedProps = chartPropsSchema.parse(props);

  const {
    data,
    type,
    series,
    height = 300,
    title,
    subtitle,
    xAxisLabel,
    yAxisLabel,
    showLegend = true,
    legendPosition = "bottom",
    showGrid = true,
    gridStyle = "dashed",
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    animated = true,
    colorScheme = "default",
    colors,
    stacked = false,
    curved = true,
    innerRadius,
    showLabels = true,
    referenceLines,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const chartColors = colors || colorSchemes[colorScheme] || colorSchemes.default;
  const curveType = curved ? "monotone" : "linear";

  // Legend layout based on position
  const legendLayout = legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal";
  const legendAlign = legendPosition === "left" ? "left" : legendPosition === "right" ? "right" : "center";
  const legendVerticalAlign = legendPosition === "top" ? "top" : legendPosition === "bottom" ? "bottom" : "middle";

  // Common chart props
  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  // Render appropriate chart type
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray={gridStyles[gridStyle]}
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={xAxisLabel ? { value: xAxisLabel, position: "bottom", offset: 0 } : undefined}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend layout={legendLayout} align={legendAlign} verticalAlign={legendVerticalAlign} />
            )}
            {referenceLines?.map((line, index) => (
              <ReferenceLine
                key={index}
                y={line.axis === "y" ? line.value : undefined}
                x={line.axis === "x" ? line.value : undefined}
                stroke={line.color || "#ef4444"}
                strokeDasharray="5 5"
                label={line.label}
              />
            ))}
            {series ? (
              series.map((s, index) => (
                <Line
                  key={s.id}
                  type={curveType}
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  dot={{ fill: s.color || chartColors[index % chartColors.length], r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                />
              ))
            ) : (
              <Line
                type={curveType}
                dataKey="value"
                stroke={chartColors[0]}
                strokeWidth={2}
                dot={{ fill: chartColors[0], r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={animated}
              />
            )}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray={gridStyles[gridStyle]} stroke="#e2e8f0" />
            )}
            {showXAxis && (
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showYAxis && (
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend layout={legendLayout} align={legendAlign} verticalAlign={legendVerticalAlign} />
            )}
            {series ? (
              series.map((s, index) => (
                <Bar
                  key={s.id}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color || chartColors[index % chartColors.length]}
                  stackId={stacked ? "stack" : undefined}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animated}
                />
              ))
            ) : (
              <Bar
                dataKey="value"
                fill={chartColors[0]}
                radius={[4, 4, 0, 0]}
                isAnimationActive={animated}
              />
            )}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {chartColors.map((color, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {showGrid && (
              <CartesianGrid strokeDasharray={gridStyles[gridStyle]} stroke="#e2e8f0" />
            )}
            {showXAxis && (
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showYAxis && (
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend layout={legendLayout} align={legendAlign} verticalAlign={legendVerticalAlign} />
            )}
            {series ? (
              series.map((s, index) => (
                <Area
                  key={s.id}
                  type={curveType}
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || chartColors[index % chartColors.length]}
                  fill={`url(#gradient-${index})`}
                  stackId={stacked ? "stack" : undefined}
                  isAnimationActive={animated}
                />
              ))
            ) : (
              <Area
                type={curveType}
                dataKey="value"
                stroke={chartColors[0]}
                fill="url(#gradient-0)"
                isAnimationActive={animated}
              />
            )}
          </AreaChart>
        );

      case "pie":
      case "donut":
        const pieInnerRadius = type === "donut" ? (innerRadius ?? 0.6) * 100 : 0;
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={pieInnerRadius}
              outerRadius="80%"
              paddingAngle={2}
              isAnimationActive={animated}
              label={showLabels ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : false}
              labelLine={showLabels}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend layout={legendLayout} align={legendAlign} verticalAlign={legendVerticalAlign} />
            )}
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray={gridStyles[gridStyle]} stroke="#e2e8f0" />
            )}
            {showXAxis && (
              <XAxis type="number" dataKey="value" stroke="#94a3b8" fontSize={12} />
            )}
            {showYAxis && (
              <YAxis type="number" dataKey="value2" stroke="#94a3b8" fontSize={12} />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Scatter data={data} fill={chartColors[0]} isAnimationActive={animated} />
          </ScatterChart>
        );

      case "composed":
        return (
          <ComposedChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray={gridStyles[gridStyle]} stroke="#e2e8f0" />
            )}
            {showXAxis && (
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showYAxis && (
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend layout={legendLayout} align={legendAlign} verticalAlign={legendVerticalAlign} />
            )}
            {series?.map((s, index) => {
              if (s.type === "bar") {
                return (
                  <Bar
                    key={s.id}
                    dataKey={s.dataKey}
                    name={s.name}
                    fill={s.color || chartColors[index % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={animated}
                  />
                );
              } else if (s.type === "area") {
                return (
                  <Area
                    key={s.id}
                    type={curveType}
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color || chartColors[index % chartColors.length]}
                    fill={s.color || chartColors[index % chartColors.length]}
                    fillOpacity={0.2}
                    isAnimationActive={animated}
                  />
                );
              }
              return (
                <Line
                  key={s.id}
                  type={curveType}
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color || chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  isAnimationActive={animated}
                />
              );
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6",
        className
      )}
      id={id}
      aria-label={ariaLabel || title || "Chart"}
      data-testid={dataTestId}
    >
      {/* Title */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
}

Chart.displayName = "Chart";
