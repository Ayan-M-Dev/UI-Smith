"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type DashboardLayoutProps,
  type NavItem,
  dashboardLayoutPropsSchema,
} from "@/schemas/dashboard-layout.schema";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
} from "lucide-react";

/**
 * Dashboard Layout Component
 * ==========================
 * A comprehensive dashboard layout with sidebar, header, and content areas.
 */

// Get Lucide icon by name
function getIcon(name: string | undefined): React.ElementType {
  if (!name) return LucideIcons.Circle;
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return ((LucideIcons as any) as Record<string, React.ElementType>)[pascalName] || LucideIcons.Circle;
}

// Width mapping for sidebar
const sidebarWidths = {
  narrow: "w-16",
  default: "w-64",
  wide: "w-80",
};

// Collapsed width
const collapsedWidth = "w-16";

// Navigation Item Component
function NavItemComponent({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = getIcon(item.icon);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <a
        href={item.href || "#"}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          item.active
            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50",
          depth > 0 && "ml-6 text-sm"
        )}
      >
        <Icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
        
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            
            {item.badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  item.badgeVariant === "destructive"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : item.badgeVariant === "success"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : item.badgeVariant === "warning"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {item.badge}
              </span>
            )}
            
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </a>

      {/* Children */}
      {hasChildren && !collapsed && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {item.children!.map((child) => (
                <a
                  key={child.id}
                  href={child.href || "#"}
                  className="flex items-center gap-3 px-3 py-2 ml-8 text-sm rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
                >
                  {child.icon && React.createElement(getIcon(child.icon), { className: "w-4 h-4" })}
                  <span>{child.label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Sidebar Component
function Sidebar({
  config,
  collapsed,
  onToggle,
  onClose,
  isMobile,
}: {
  config: DashboardLayoutProps["sidebar"];
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  if (!config) return null;

  return (
    <motion.aside
      initial={isMobile ? { x: -300 } : false}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className={cn(
        "h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
        collapsed ? collapsedWidth : sidebarWidths[config.width || "default"],
        isMobile && "fixed inset-y-0 left-0 z-50 shadow-xl"
      )}
    >
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        {config.logo ? (
          <img
            src={config.logo}
            alt={config.logoAlt || "Logo"}
            className={cn("h-8", collapsed ? "mx-auto" : "")}
          />
        ) : config.title ? (
          <h1
            className={cn(
              "font-bold text-lg text-slate-900 dark:text-white",
              collapsed && "hidden"
            )}
          >
            {config.title}
          </h1>
        ) : (
          <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-purple-600 rounded-lg" />
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Collapse toggle */}
        {!isMobile && config.collapsible && (
          <button
            onClick={onToggle}
            className={cn(
              "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              collapsed ? "mx-auto" : "ml-auto"
            )}
          >
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                !collapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {config.navItems.map((item) => (
          <NavItemComponent key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User Profile */}
      {config.showUserProfile && config.userInfo && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
              collapsed && "justify-center"
            )}
          >
            {config.userInfo.avatarUrl ? (
              <img
                src={config.userInfo.avatarUrl}
                alt={config.userInfo.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {config.userInfo.name.charAt(0)}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {config.userInfo.name}
                </p>
                {config.userInfo.email && (
                  <p className="text-xs text-slate-500 truncate">
                    {config.userInfo.email}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {config.footerContent && !collapsed && (
        <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-200 dark:border-slate-800">
          {config.footerContent}
        </div>
      )}
    </motion.aside>
  );
}

// Header Component
function Header({
  config,
  onMenuClick,
}: {
  config: DashboardLayoutProps["header"];
  onMenuClick: () => void;
}) {
  if (!config) return null;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title & Breadcrumbs */}
      <div className="flex-1">
        {config.showBreadcrumbs && config.breadcrumbs && (
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            {config.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <a
                  href={crumb.href}
                  className={cn(
                    index === config.breadcrumbs!.length - 1
                      ? "text-slate-900 dark:text-white font-medium"
                      : "hover:text-slate-700"
                  )}
                >
                  {crumb.label}
                </a>
              </React.Fragment>
            ))}
          </nav>
        )}
        {config.title && (
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            {config.title}
          </h1>
        )}
      </div>

      {/* Search */}
      {config.showSearch && (
        <div className="hidden md:flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 dark:text-slate-300"
          />
        </div>
      )}

      {/* Actions */}
      {config.actions && config.actions.length > 0 && (
        <div className="hidden sm:flex items-center gap-2">
          {config.actions.map((action) => {
            const Icon = getIcon(action.icon);
            return (
              <button
                key={action.id}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  action.variant === "solid"
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : action.variant === "outline"
                    ? "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                )}
              >
                {action.icon && <Icon className="w-4 h-4 inline-block mr-1" />}
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Notifications */}
      {config.showNotifications && (
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5 text-slate-500" />
          {config.notificationCount && config.notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {config.notificationCount > 9 ? "9+" : config.notificationCount}
            </span>
          )}
        </button>
      )}

      {/* User Menu */}
      {config.showUserMenu && (
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600" />
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="p-2">
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="w-4 h-4" />
                Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <hr className="my-2 border-slate-200 dark:border-slate-700" />
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function DashboardLayout(props: DashboardLayoutProps) {
  const validatedProps = dashboardLayoutPropsSchema.parse(props);

  const {
    sidebar,
    showSidebar = true,
    header,
    showHeader = true,
    pageTitle,
    pageDescription,
    layout = "sidebar-header",
    contentPadding = "md",
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    sidebar?.defaultCollapsed || false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const showSidebarInLayout =
    showSidebar && (layout === "sidebar-header" || layout === "sidebar-only");
  const showHeaderInLayout =
    showHeader && (layout === "sidebar-header" || layout === "header-only");

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-50 dark:bg-slate-950 flex",
        className
      )}
      id={id}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      {showSidebarInLayout && sidebar && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              config={sidebar}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              onClose={() => {}}
              isMobile={false}
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <Sidebar
                config={sidebar}
                collapsed={false}
                onToggle={() => {}}
                onClose={() => setMobileMenuOpen(false)}
                isMobile={true}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {showHeaderInLayout && header && (
          <Header
            config={header}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        )}

        {/* Page Content */}
        <main className={cn("flex-1", paddingClasses[contentPadding])}>
          {/* Page Title */}
          {(pageTitle || pageDescription) && (
            <div className="mb-6">
              {pageTitle && (
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pageTitle}
                </h1>
              )}
              {pageDescription && (
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {pageDescription}
                </p>
              )}
            </div>
          )}

          {/* Placeholder for child content */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Dashboard content goes here
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

DashboardLayout.displayName = "DashboardLayout";
