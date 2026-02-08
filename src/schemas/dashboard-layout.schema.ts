import { z } from "zod";
import { iconNameSchema, basePropsSchema } from "./common.schema";

/**
 * Dashboard Layout Schema
 * =======================
 * Defines props for structured dashboard layouts with sidebar, header, and content areas.
 */

// Navigation item for sidebar/header
export const navItemSchema = z.object({
    id: z.string(),
    label: z.string().describe("Display text for the nav item"),
    icon: iconNameSchema.optional().describe("Icon for the nav item"),
    href: z.string().optional().describe("Navigation URL"),
    badge: z.string().optional().describe("Badge text (e.g., notification count)"),
    badgeVariant: z.enum(["default", "destructive", "success", "warning"]).optional(),
    active: z.boolean().optional().describe("Whether this item is currently active"),
    children: z.array(z.object({
        id: z.string(),
        label: z.string(),
        href: z.string().optional(),
        icon: iconNameSchema.optional(),
    })).optional().describe("Nested navigation items"),
});

// Sidebar configuration
export const sidebarConfigSchema = z.object({
    // Brand
    logo: z.string().optional().describe("URL or text for the logo"),
    logoAlt: z.string().optional().describe("Alt text for logo image"),
    title: z.string().optional().describe("Application/dashboard title"),

    // Navigation
    navItems: z.array(navItemSchema).describe("Main navigation items"),

    // Layout
    position: z.enum(["left", "right"]).optional().default("left"),
    width: z.enum(["narrow", "default", "wide"]).optional().default("default"),
    collapsible: z.boolean().optional().default(true),
    defaultCollapsed: z.boolean().optional().default(false),

    // Footer
    footerContent: z.string().optional().describe("Footer text in sidebar"),
    showUserProfile: z.boolean().optional().default(true),
    userInfo: z.object({
        name: z.string(),
        email: z.string().optional(),
        avatarUrl: z.string().optional(),
    }).optional(),
});

// Header configuration
export const headerConfigSchema = z.object({
    // Title
    title: z.string().optional().describe("Page or section title"),
    subtitle: z.string().optional(),
    showBreadcrumbs: z.boolean().optional().default(false),
    breadcrumbs: z.array(z.object({
        label: z.string(),
        href: z.string().optional(),
    })).optional(),

    // Actions
    actions: z.array(z.object({
        id: z.string(),
        label: z.string(),
        icon: iconNameSchema.optional(),
        variant: z.enum(["solid", "outline", "ghost"]).optional(),
    })).optional().describe("Action buttons in the header"),

    // Search
    showSearch: z.boolean().optional().default(false),
    searchPlaceholder: z.string().optional().default("Search..."),

    // Notifications
    showNotifications: z.boolean().optional().default(true),
    notificationCount: z.number().optional(),

    // User menu
    showUserMenu: z.boolean().optional().default(true),
});

export const dashboardLayoutPropsSchema = basePropsSchema.extend({
    // Sidebar
    sidebar: sidebarConfigSchema.optional(),
    showSidebar: z.boolean().optional().default(true),

    // Header
    header: headerConfigSchema.optional(),
    showHeader: z.boolean().optional().default(true),

    // Content area
    pageTitle: z.string().optional().describe("Title for the main content area"),
    pageDescription: z.string().optional(),

    // Layout options
    layout: z.enum([
        "sidebar-header",    // Sidebar + header + content
        "header-only",       // Just header + content
        "sidebar-only",      // Just sidebar + content
        "minimal",           // Just content with padding
    ]).optional().default("sidebar-header"),

    contentPadding: z.enum(["none", "sm", "md", "lg"]).optional().default("md"),

    // Theme
    theme: z.enum(["light", "dark", "system"]).optional().default("system"),

    // Responsive
    mobileMenuBreakpoint: z.enum(["sm", "md", "lg"]).optional().default("md"),
});

export type NavItem = z.infer<typeof navItemSchema>;
export type SidebarConfig = z.infer<typeof sidebarConfigSchema>;
export type HeaderConfig = z.infer<typeof headerConfigSchema>;
export type DashboardLayoutProps = z.infer<typeof dashboardLayoutPropsSchema>;
