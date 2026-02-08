"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Code,
  Eye,
  Wand2,
  Layout,
  Palette,
  Accessibility,
  Download,
  Copy,
  Check,
  RefreshCw,
  ChevronRight,
  MessageSquare,
  Layers,
  Settings,
  Moon,
  Sun,
  Github,
  Zap,
  Box,
  FileCode,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import components for preview
import { Button } from "@/components/generative/button";
import { Card } from "@/components/generative/card";
import { PricingTable } from "@/components/generative/pricing-table";
import { Chart } from "@/components/generative/chart";
import { Form } from "@/components/generative/form";
import { Modal } from "@/components/generative/modal";
import { TestimonialSection } from "@/components/generative/testimonial-section";

// Types
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  uiSpec?: unknown;
}

interface PreviewComponent {
  name: string;
  props: Record<string, unknown>;
}

// Agent status for visualization
interface AgentStatus {
  name: string;
  status: "idle" | "working" | "done" | "error";
  message?: string;
}

export default function UISmithApp() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to UI-Smith! ✨ Describe the UI you want to create, and I'll generate it for you in real-time. Try something like:\n\n• \"Create a SaaS pricing page\"\n• \"Build a modern hero section with a CTA\"\n• \"Design a testimonial section\"\n• \"Make a contact form\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "tree">("preview");
  const [previewComponents, setPreviewComponents] = useState<PreviewComponent[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { name: "UI Architect", status: "idle" },
    { name: "Design Critic", status: "idle" },
    { name: "Accessibility", status: "idle" },
    { name: "Export", status: "idle" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate agent pipeline
    await simulateAgentPipeline(input);
  };

  // Simulate the agent pipeline with visual feedback
  const simulateAgentPipeline = async (userInput: string) => {
    const updateAgentStatus = (index: number, status: AgentStatus["status"], message?: string) => {
      setAgentStatuses((prev) => 
        prev.map((agent, i) => 
          i === index ? { ...agent, status, message } : agent
        )
      );
    };

    // Reset statuses
    setAgentStatuses((prev) => prev.map((a) => ({ ...a, status: "idle", message: undefined })));

    // Step 1: UI Architect
    updateAgentStatus(0, "working", "Creating UI specification...");
    await delay(1500);
    const components = generateComponentsFromInput(userInput);
    setPreviewComponents(components);
    updateAgentStatus(0, "done", "UI created");

    // Step 2: Design Critic
    updateAgentStatus(1, "working", "Reviewing design...");
    await delay(1000);
    updateAgentStatus(1, "done", "Score: 85/100");

    // Step 3: Accessibility
    updateAgentStatus(2, "working", "Checking accessibility...");
    await delay(800);
    updateAgentStatus(2, "done", "WCAG AA: Pass");

    // Step 4: Export
    updateAgentStatus(3, "working", "Generating code...");
    await delay(800);
    const code = generateCode(components);
    setGeneratedCode(code);
    updateAgentStatus(3, "done", "Ready to export");

    // Add assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've created your UI with ${components.length} component${components.length > 1 ? "s" : ""}. You can:\n\n• **Preview** the rendered UI on the right\n• View and copy the **Code**\n• See the **Component Tree**\n\nWant me to make any changes?`,
      timestamp: new Date(),
      uiSpec: components,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  // Generate components based on input
  const generateComponentsFromInput = (input: string): PreviewComponent[] => {
    const lower = input.toLowerCase();
    const components: PreviewComponent[] = [];

    if (lower.includes("pricing")) {
      components.push({
        name: "PricingTable",
        props: {
          headline: "Simple, Transparent Pricing",
          subheadline: "Choose the plan that's right for you",
          tiers: [
            {
              id: "starter",
              name: "Starter",
              price: 9,
              currency: "USD",
              billingPeriod: "month",
              description: "Perfect for individuals",
              features: [
                { text: "5 Projects", included: true },
                { text: "Basic Support", included: true },
                { text: "1GB Storage", included: true },
                { text: "API Access", included: false },
              ],
              ctaText: "Get Started",
            },
            {
              id: "pro",
              name: "Professional",
              price: 29,
              currency: "USD",
              billingPeriod: "month",
              description: "Best for professionals",
              features: [
                { text: "Unlimited Projects", included: true },
                { text: "Priority Support", included: true },
                { text: "10GB Storage", included: true },
                { text: "API Access", included: true },
              ],
              ctaText: "Start Free Trial",
              featured: true,
              badge: "Most Popular",
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: 99,
              currency: "USD",
              billingPeriod: "month",
              description: "For large teams",
              features: [
                { text: "Unlimited Everything", included: true },
                { text: "24/7 Support", included: true },
                { text: "Unlimited Storage", included: true },
                { text: "Custom Integrations", included: true },
              ],
              ctaText: "Contact Sales",
            },
          ],
          showBillingToggle: true,
          yearlyDiscount: 20,
        },
      });
    } else if (lower.includes("testimonial") || lower.includes("review")) {
      components.push({
        name: "TestimonialSection",
        props: {
          headline: "Loved by Thousands",
          subheadline: "See what our customers have to say",
          testimonials: [
            {
              id: "1",
              quote: "This product transformed our workflow completely. We've seen a 3x increase in productivity!",
              authorName: "Sarah Johnson",
              authorRole: "CEO",
              authorCompany: "TechCorp",
              rating: 5,
            },
            {
              id: "2",
              quote: "The best investment we've made this year. The ROI speaks for itself.",
              authorName: "Michael Chen",
              authorRole: "Director of Operations",
              authorCompany: "StartupXYZ",
              rating: 5,
            },
            {
              id: "3",
              quote: "Incredible support and a product that just works. Highly recommended!",
              authorName: "Emily Brown",
              authorRole: "Product Manager",
              authorCompany: "InnovateCo",
              rating: 5,
            },
          ],
          layout: "grid",
          columns: 3,
          showRatings: true,
          showAvatars: true,
          cardStyle: "elevated",
        },
      });
    } else if (lower.includes("form") || lower.includes("contact")) {
      components.push({
        name: "Form",
        props: {
          title: "Get in Touch",
          description: "We'd love to hear from you. Send us a message!",
          fields: [
            { id: "name", name: "name", type: "text", label: "Full Name", placeholder: "John Doe", required: true, width: "half" },
            { id: "email", name: "email", type: "email", label: "Email", placeholder: "john@example.com", required: true, width: "half" },
            { id: "subject", name: "subject", type: "select", label: "Subject", options: [
              { value: "general", label: "General Inquiry" },
              { value: "support", label: "Technical Support" },
              { value: "sales", label: "Sales" },
            ], required: true },
            { id: "message", name: "message", type: "textarea", label: "Message", placeholder: "How can we help?", required: true },
          ],
          submitText: "Send Message",
          showSubmitButton: true,
          showValidationOnBlur: true,
        },
      });
    } else if (lower.includes("chart") || lower.includes("analytics") || lower.includes("data")) {
      components.push({
        name: "Chart",
        props: {
          type: "line",
          title: "Revenue Overview",
          subtitle: "Monthly revenue for the past 6 months",
          data: [
            { name: "Jan", value: 12000 },
            { name: "Feb", value: 19000 },
            { name: "Mar", value: 15000 },
            { name: "Apr", value: 24000 },
            { name: "May", value: 21000 },
            { name: "Jun", value: 28000 },
          ],
          height: 300,
          showLegend: true,
          showGrid: true,
          animated: true,
          colorScheme: "default",
        },
      });
    } else if (lower.includes("hero") || lower.includes("landing")) {
      components.push({
        name: "Card",
        props: {
          variant: "gradient",
          title: "Build Amazing Products",
          subtitle: "The future of development",
          content: "Create beautiful, responsive UIs in minutes with our AI-powered design tool. No coding required.",
          size: "lg",
          hoverable: true,
        },
      });
      components.push({
        name: "Button",
        props: {
          text: "Get Started Free",
          variant: "solid",
          color: "primary",
          size: "lg",
        },
      });
    } else {
      // Default: Card + Button
      components.push({
        name: "Card",
        props: {
          variant: "elevated",
          title: "Welcome to UI-Smith",
          content: "This is a sample card component. Describe your UI to generate custom components!",
          hoverable: true,
        },
      });
      components.push({
        name: "Button",
        props: {
          text: "Learn More",
          variant: "solid",
          color: "primary",
          size: "md",
        },
      });
    }

    return components;
  };

  // Generate code from components
  const generateCode = (components: PreviewComponent[]): string => {
    const imports = [...new Set(components.map((c) => c.name))].join(", ");
    const componentCode = components
      .map((comp) => {
        const propsStr = Object.entries(comp.props)
          .map(([k, v]) => {
            if (typeof v === "string") return `${k}="${v}"`;
            if (typeof v === "boolean") return v ? k : `${k}={false}`;
            if (typeof v === "number") return `${k}={${v}}`;
            return `${k}={${JSON.stringify(v, null, 2)}}`;
          })
          .join("\n        ");
        return `      <${comp.name}
        ${propsStr}
      />`;
      })
      .join("\n\n");

    return `"use client";

import { ${imports} } from "@/components/generative";

export default function GeneratedUI() {
  return (
    <main className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
${componentCode}
    </main>
  );
}`;
  };

  // Copy code to clipboard
  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render component preview
  const renderComponent = (component: PreviewComponent, index: number) => {
    const props = component.props as Record<string, unknown>;
    
    switch (component.name) {
      case "Button":
        return <Button key={index} {...(props as React.ComponentProps<typeof Button>)} />;
      case "Card":
        return <Card key={index} {...(props as React.ComponentProps<typeof Card>)} />;
      case "PricingTable":
        return <PricingTable key={index} {...(props as React.ComponentProps<typeof PricingTable>)} />;
      case "Chart":
        return <Chart key={index} {...(props as React.ComponentProps<typeof Chart>)} />;
      case "Form":
        return <Form key={index} {...(props as React.ComponentProps<typeof Form>)} />;
      case "Modal":
        return <Modal key={index} {...(props as React.ComponentProps<typeof Modal>)} />;
      case "TestimonialSection":
        return <TestimonialSection key={index} {...(props as React.ComponentProps<typeof TestimonialSection>)} />;
      default:
        return <div key={index}>Unknown component: {component.name}</div>;
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col", isDarkMode ? "dark" : "")}>
      {/* Header */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">UI-Smith</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
            Beta
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left: Chat Panel */}
        <div className="w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          {/* Agent Status */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Agent Pipeline</div>
            <div className="grid grid-cols-4 gap-2">
              {agentStatuses.map((agent, index) => (
                <div
                  key={agent.name}
                  className={cn(
                    "p-2 rounded-lg text-center transition-all",
                    agent.status === "idle" && "bg-slate-100 dark:bg-slate-800",
                    agent.status === "working" && "bg-violet-100 dark:bg-violet-900/30 animate-pulse",
                    agent.status === "done" && "bg-emerald-100 dark:bg-emerald-900/30",
                    agent.status === "error" && "bg-red-100 dark:bg-red-900/30"
                  )}
                >
                  <div className="flex justify-center mb-1">
                    {index === 0 && <Layout className="w-4 h-4" />}
                    {index === 1 && <Palette className="w-4 h-4" />}
                    {index === 2 && <Accessibility className="w-4 h-4" />}
                    {index === 3 && <Download className="w-4 h-4" />}
                  </div>
                  <div className="text-[10px] font-medium truncate">{agent.name}</div>
                  {agent.message && (
                    <div className="text-[9px] text-slate-500 truncate">{agent.message}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    message.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              </motion.div>
            ))}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-violet-500" />
                    <span className="text-sm text-slate-500">Generating UI...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe the UI you want to create..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className={cn(
                  "absolute right-2 bottom-2 p-2 rounded-lg transition-colors",
                  input.trim() && !isGenerating
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Preview/Code Panel */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
          {/* Tabs */}
          <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 gap-1">
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                activeTab === "preview"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                activeTab === "code"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Code className="w-4 h-4" />
              Code
            </button>
            <button
              onClick={() => setActiveTab("tree")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
                activeTab === "tree"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Layers className="w-4 h-4" />
              Tree
            </button>

            <div className="flex-1" />

            {activeTab === "code" && generatedCode && (
              <button
                onClick={copyCode}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {previewComponents.length > 0 ? (
                    previewComponents.map((comp, index) => (
                      <div key={index} className="animate-fade-in">
                        {renderComponent(comp, index)}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                        <Wand2 className="w-8 h-8 text-violet-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No UI Generated Yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Describe the UI you want in the chat, and it will appear here as real, interactive components.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "code" && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {generatedCode ? (
                    <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono">
                      <code>{generatedCode}</code>
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                        <FileCode className="w-8 h-8 text-violet-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No Code Yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Generate a UI to see the production-ready React code.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "tree" && (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {previewComponents.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <div className="font-mono text-sm">
                        <div className="text-violet-600 dark:text-violet-400">GeneratedUI</div>
                        {previewComponents.map((comp, index) => (
                          <div key={index} className="ml-4 mt-2">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                              <span className="text-cyan-600 dark:text-cyan-400">&lt;{comp.name}&gt;</span>
                            </div>
                            <div className="ml-6 text-slate-500 dark:text-slate-400 text-xs">
                              {Object.keys(comp.props).slice(0, 5).map((key) => (
                                <div key={key}>
                                  {key}: {typeof comp.props[key] === "object" ? "[object]" : String(comp.props[key]).slice(0, 30)}
                                </div>
                              ))}
                              {Object.keys(comp.props).length > 5 && (
                                <div className="text-slate-400">... +{Object.keys(comp.props).length - 5} more</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                        <Box className="w-8 h-8 text-violet-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No Component Tree
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Generate a UI to see the component hierarchy.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
