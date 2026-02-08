/**
 * MCP Server Configuration
 * ========================
 * Defines connections to Model Context Protocol servers for extended capabilities.
 */

// Define transport type as per @tambo-ai/react/mcp
enum MCPTransport {
    HTTP = "HTTP",
    SSE = "SSE",
}

interface MCPServerConfig {
    name: string;
    url: string;
    serverKey?: string;
    transport?: MCPTransport;
    customHeaders?: Record<string, string>;
}

/**
 * MCP Server URLs
 * In production, these would be environment variables or dynamic configuration.
 * For development, we use localhost ports for each MCP server.
 */
const MCP_BASE_URL = process.env.NEXT_PUBLIC_MCP_BASE_URL || "http://localhost";

export const mcpServers: any[] = [
    {
        name: "design-system",
        url: `${MCP_BASE_URL}:8261/mcp`,
        serverKey: "design",
        transport: MCPTransport.HTTP,
    },
    {
        name: "accessibility",
        url: `${MCP_BASE_URL}:8262/mcp`,
        serverKey: "a11y",
        transport: MCPTransport.HTTP,
    },
    {
        name: "ux-best-practices",
        url: `${MCP_BASE_URL}:8263/mcp`,
        serverKey: "ux",
        transport: MCPTransport.HTTP,
    },
    {
        name: "export",
        url: `${MCP_BASE_URL}:8264/mcp`,
        serverKey: "export",
        transport: MCPTransport.HTTP,
    },
];

/**
 * Get MCP server by name
 */
export function getMCPServer(name: string): MCPServerConfig | undefined {
    return mcpServers.find((server) => server.name === name);
}

/**
 * Server port mapping for development
 */
export const MCP_PORTS = {
    "design-system": 8261,
    accessibility: 8262,
    "ux-best-practices": 8263,
    export: 8264,
} as const;
