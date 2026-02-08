"use client";

import React from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "./component-registry";
import { mcpServers } from "./mcp-config";

/**
 * Tambo Client Provider
 * =====================
 * Wraps the application with Tambo context for generative UI.
 */

interface TamboClientProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export function TamboClientProvider({
  children,
  apiKey,
}: TamboClientProviderProps) {
  // Get API key from props or environment
  const tamboApiKey = apiKey || process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!tamboApiKey) {
    console.warn(
      "Warning: NEXT_PUBLIC_TAMBO_API_KEY is not set. Tambo features will not work."
    );
  }

  const TamboProviderAny = TamboProvider as any;

  return (
    <TamboProviderAny
      apiKey={tamboApiKey || ""}
      components={tamboComponents}
      mcpServers={mcpServers}
    >
      {children}
    </TamboProviderAny>
  );
}
