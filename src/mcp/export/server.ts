/**
 * Export MCP Server
 * =================
 * Purpose: Converts rendered UI into production-ready code formats.
 * 
 * Tools:
 * - export_react_code: Generates React + Tailwind code
 * - export_json_schema: Exports component tree as JSON schema
 * - export_component_tree: Exports hierarchical component structure
 * - generate_storybook_story: Generates Storybook stories for components
 * 
 * Resources:
 * - export://templates: Available export templates
 * - export://formats: Supported export formats
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "export",
    version: "1.0.0",
});

// ============================================================================
// CODE TEMPLATES
// ============================================================================

/**
 * Generate React component code from props
 */
function generateReactCode(
    componentName: string,
    props: Record<string, unknown>,
    options: { typescript: boolean; tailwind: boolean }
): string {
    const propsString = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
            if (typeof value === "string") {
                return `${key}="${value}"`;
            } else if (typeof value === "boolean") {
                return value ? key : `${key}={false}`;
            } else if (typeof value === "number") {
                return `${key}={${value}}`;
            } else {
                return `${key}={${JSON.stringify(value)}}`;
            }
        })
        .join("\n      ");

    const code = `import { ${componentName} } from "@/components/generative";

export function Example${componentName}() {
  return (
    <${componentName}
      ${propsString}
    />
  );
}`;

    return code;
}

/**
 * Generate full page code with multiple components
 */
function generatePageCode(
    components: Array<{ name: string; props: Record<string, unknown> }>,
    options: { typescript: boolean; framework: string }
): string {
    const imports = [...new Set(components.map((c) => c.name))].join(", ");

    const componentCode = components
        .map((comp, index) => {
            const propsString = Object.entries(comp.props)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => {
                    if (typeof value === "string") {
                        return `${key}="${value}"`;
                    } else if (typeof value === "boolean") {
                        return value ? key : `${key}={false}`;
                    } else if (typeof value === "number") {
                        return `${key}={${value}}`;
                    } else {
                        return `${key}={${JSON.stringify(value, null, 8).split("\n").join("\n        ")}}`;
                    }
                })
                .join("\n        ");

            return `      <${comp.name}
        ${propsString}
      />`;
        })
        .join("\n\n");

    let code = "";

    if (options.framework === "nextjs") {
        code = `"use client";

import { ${imports} } from "@/components/generative";

export default function GeneratedPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
${componentCode}
    </main>
  );
}`;
    } else {
        code = `import { ${imports} } from "@/components/generative";

function GeneratedPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
${componentCode}
    </main>
  );
}

export default GeneratedPage;`;
    }

    return code;
}

/**
 * Generate Tailwind CSS for component customization
 */
function generateTailwindCSS(
    components: Array<{ name: string; props: Record<string, unknown> }>
): string {
    const css = `/* Custom styles for generated components */

/* Base component customizations */
.generated-ui {
  @apply min-h-screen bg-slate-50 dark:bg-slate-950;
}

/* Button customizations */
.generated-button-primary {
  @apply bg-gradient-to-r from-violet-600 to-purple-600 text-white;
  @apply hover:from-violet-700 hover:to-purple-700;
  @apply shadow-lg shadow-violet-500/25;
}

/* Card customizations */
.generated-card {
  @apply bg-white dark:bg-slate-900;
  @apply rounded-xl shadow-lg;
  @apply border border-slate-200 dark:border-slate-800;
}

/* Form customizations */
.generated-form-input {
  @apply w-full px-4 py-2;
  @apply border border-slate-200 dark:border-slate-700;
  @apply rounded-lg bg-white dark:bg-slate-800;
  @apply focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500;
}

/* Chart customizations */
.generated-chart {
  @apply bg-white dark:bg-slate-900;
  @apply rounded-xl border border-slate-200 dark:border-slate-800;
  @apply p-6;
}

/* Animation classes */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
`;

    return css;
}

// ============================================================================
// TOOLS
// ============================================================================

// Tool: Export React code
server.tool(
    "export_react_code",
    "Generates React + Tailwind code from component configuration",
    {
        components: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()),
        })).describe("Components to export"),
        options: z.object({
            typescript: z.boolean().default(true),
            framework: z.enum(["nextjs", "vite", "cra"]).default("nextjs"),
            includeCSS: z.boolean().default(true),
            singleFile: z.boolean().default(true),
        }).optional(),
    },
    async ({ components, options = {} }) => {
        const opts = {
            typescript: options.typescript ?? true,
            framework: options.framework ?? "nextjs",
            includeCSS: options.includeCSS ?? true,
            singleFile: options.singleFile ?? true,
        };

        const files: Array<{ filename: string; content: string }> = [];

        if (opts.singleFile) {
            // Generate single page file
            const pageCode = generatePageCode(components, opts);
            files.push({
                filename: opts.typescript ? "page.tsx" : "page.jsx",
                content: pageCode,
            });
        } else {
            // Generate separate files for each component
            components.forEach((comp, index) => {
                const code = generateReactCode(comp.name, comp.props, {
                    typescript: opts.typescript,
                    tailwind: true,
                });
                files.push({
                    filename: opts.typescript
                        ? `${comp.name}Example${index}.tsx`
                        : `${comp.name}Example${index}.jsx`,
                    content: code,
                });
            });
        }

        // Include CSS if requested
        if (opts.includeCSS) {
            const css = generateTailwindCSS(components);
            files.push({
                filename: "generated.css",
                content: css,
            });
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        success: true,
                        fileCount: files.length,
                        files: files.map((f) => ({
                            filename: f.filename,
                            preview: f.content.substring(0, 200) + (f.content.length > 200 ? "..." : ""),
                            fullContent: f.content,
                        })),
                    }, null, 2),
                },
            ],
        };
    }
);

// Tool: Export JSON schema
server.tool(
    "export_json_schema",
    "Exports the component configuration as a JSON schema for portability",
    {
        components: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()),
        })).describe("Components to export"),
        includeMetadata: z.boolean().optional().default(true),
    },
    async ({ components, includeMetadata }) => {
        const schema: Record<string, unknown> = {
            $schema: "https://json-schema.org/draft/2020-12/schema",
            title: "UI-Smith Generated UI",
            version: "1.0.0",
        };

        if (includeMetadata) {
            schema.metadata = {
                generatedAt: new Date().toISOString(),
                generatedBy: "UI-Smith",
                componentCount: components.length,
            };
        }

        schema.components = components.map((comp, index) => ({
            id: `component-${index}`,
            type: comp.name,
            props: comp.props,
        }));

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify(schema, null, 2),
                },
            ],
        };
    }
);

// Tool: Export component tree
server.tool(
    "export_component_tree",
    "Exports a hierarchical view of the component structure",
    {
        components: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()),
            children: z.array(z.string()).optional(),
        })).describe("Components with optional children references"),
    },
    async ({ components }) => {
        // Build tree structure
        const tree = {
            root: "GeneratedPage",
            children: components.map((comp, index) => ({
                id: `node-${index}`,
                component: comp.name,
                props: Object.keys(comp.props),
                children: comp.children || [],
            })),
        };

        // Generate ASCII tree visualization
        let asciiTree = "GeneratedPage\n";
        components.forEach((comp, index) => {
            const isLast = index === components.length - 1;
            const prefix = isLast ? "└── " : "├── ";
            const propsList = Object.keys(comp.props).slice(0, 3).join(", ");
            const propsPreview = propsList + (Object.keys(comp.props).length > 3 ? "..." : "");
            asciiTree += `${prefix}${comp.name} (${propsPreview})\n`;
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        tree,
                        visualization: asciiTree,
                    }, null, 2),
                },
            ],
        };
    }
);

// Tool: Generate Storybook story
server.tool(
    "generate_storybook_story",
    "Generates Storybook stories for the component",
    {
        componentName: z.string().describe("Name of the component"),
        variants: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()),
        })).describe("Different variants/states to showcase"),
    },
    async ({ componentName, variants }) => {
        const story = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "@/components/generative";

const meta: Meta<typeof ${componentName}> = {
  title: "Generative/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

${variants
                .map(
                    (variant) => `export const ${variant.name.replace(/\s+/g, "")}: Story = {
  args: ${JSON.stringify(variant.props, null, 4).split("\n").join("\n  ")},
};`
                )
                .join("\n\n")}
`;

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        success: true,
                        filename: `${componentName}.stories.tsx`,
                        content: story,
                    }, null, 2),
                },
            ],
        };
    }
);

// Tool: Generate full export package
server.tool(
    "generate_export_package",
    "Generates a complete export package with all files needed to use the UI",
    {
        components: z.array(z.object({
            name: z.string(),
            props: z.record(z.unknown()),
        })).describe("Components to export"),
        projectName: z.string().optional().default("generated-ui"),
    },
    async ({ components, projectName }) => {
        const files: Array<{ path: string; content: string }> = [];

        // Generate main page
        const pageCode = generatePageCode(components, {
            typescript: true,
            framework: "nextjs",
        });
        files.push({
            path: `${projectName}/app/page.tsx`,
            content: pageCode,
        });

        // Generate CSS
        const css = generateTailwindCSS(components);
        files.push({
            path: `${projectName}/styles/generated.css`,
            content: css,
        });

        // Generate JSON config
        const config = {
            name: projectName,
            version: "1.0.0",
            generatedAt: new Date().toISOString(),
            components: components.map((c) => ({
                name: c.name,
                props: c.props,
            })),
        };
        files.push({
            path: `${projectName}/ui-smith.config.json`,
            content: JSON.stringify(config, null, 2),
        });

        // Generate README
        const readme = `# ${projectName}

This UI was generated with [UI-Smith](https://github.com/your-repo/ui-smith).

## Components Used

${components.map((c) => `- ${c.name}`).join("\n")}

## Installation

1. Copy the generated files to your project
2. Ensure you have the required dependencies:

\`\`\`bash
npm install @tambo-ai/react framer-motion lucide-react recharts
\`\`\`

3. Import and use the components in your app

## Customization

Edit \`generated.css\` to customize styles or modify the component props directly.

---
Generated at ${new Date().toISOString()}
`;
        files.push({
            path: `${projectName}/README.md`,
            content: readme,
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: JSON.stringify({
                        success: true,
                        projectName,
                        fileCount: files.length,
                        files: files.map((f) => ({
                            path: f.path,
                            size: f.content.length,
                            preview: f.content.substring(0, 100) + "...",
                        })),
                        fullFiles: files,
                    }, null, 2),
                },
            ],
        };
    }
);

// ============================================================================
// RESOURCES
// ============================================================================

const exportTemplates = {
    nextjs: {
        name: "Next.js App Router",
        description: "Export for Next.js 14+ with App Router",
        features: ["Server Components", "TypeScript", "Tailwind CSS"],
    },
    vite: {
        name: "Vite React",
        description: "Export for Vite + React",
        features: ["Fast HMR", "TypeScript", "Tailwind CSS"],
    },
    standalone: {
        name: "Standalone HTML",
        description: "Single HTML file with inline styles",
        features: ["No build required", "CDN dependencies"],
    },
};

const exportFormats = {
    react: {
        name: "React Components",
        extension: ".tsx",
        description: "Full React component code",
    },
    json: {
        name: "JSON Schema",
        extension: ".json",
        description: "Component configuration as JSON",
    },
    storybook: {
        name: "Storybook Stories",
        extension: ".stories.tsx",
        description: "Storybook story files",
    },
    css: {
        name: "Tailwind CSS",
        extension: ".css",
        description: "Custom Tailwind styles",
    },
};

server.resource(
    "export://templates",
    "export://templates",
    async () => ({
        contents: [
            {
                uri: "export://templates",
                text: JSON.stringify(exportTemplates, null, 2),
                mimeType: "application/json",
            },
        ],
    })
);

server.resource(
    "export://formats",
    "export://formats",
    async () => ({
        contents: [
            {
                uri: "export://formats",
                text: JSON.stringify(exportFormats, null, 2),
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
    console.error("Export MCP Server running on stdio");
}

main().catch(console.error);
