"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type PricingTableProps,
  type PricingTier,
  pricingTablePropsSchema,
} from "@/schemas/pricing-table.schema";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";

/**
 * Pricing Table Component
 * =======================
 * SaaS-style pricing table with multiple tiers, features, and billing toggle.
 */

// Format price for display
function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Single pricing tier card
function TierCard({
  tier,
  isYearly,
  yearlyDiscount,
  showFeatureComparison,
  index,
}: {
  tier: PricingTier;
  isYearly: boolean;
  yearlyDiscount?: number;
  showFeatureComparison: boolean;
  index: number;
}) {
  const displayPrice = isYearly && yearlyDiscount
    ? tier.price * 12 * (1 - yearlyDiscount / 100)
    : tier.price;

  const originalYearlyPrice = tier.price * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative p-6 rounded-2xl transition-all duration-300",
        tier.featured
          ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-2xl shadow-violet-500/30 scale-105 z-10 border-0"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg"
      )}
    >
      {/* Featured badge */}
      {tier.badge && (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold",
            tier.featured
              ? "bg-amber-400 text-amber-900"
              : "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
          )}
        >
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3
          className={cn(
            "text-xl font-bold mb-2",
            tier.featured ? "text-white" : "text-slate-900 dark:text-white"
          )}
        >
          {tier.name}
        </h3>
        {tier.description && (
          <p
            className={cn(
              "text-sm",
              tier.featured ? "text-violet-200" : "text-slate-500 dark:text-slate-400"
            )}
          >
            {tier.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={cn(
              "text-4xl font-bold",
              tier.featured ? "text-white" : "text-slate-900 dark:text-white"
            )}
          >
            {formatPrice(displayPrice, tier.currency)}
          </span>
          <span
            className={cn(
              "text-sm",
              tier.featured ? "text-violet-200" : "text-slate-500"
            )}
          >
            /{isYearly ? "year" : "month"}
          </span>
        </div>
        
        {/* Original price if discounted */}
        {isYearly && yearlyDiscount && (
          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className={cn(
                "text-sm line-through",
                tier.featured ? "text-violet-300" : "text-slate-400"
              )}
            >
              {formatPrice(originalYearlyPrice, tier.currency)}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                tier.featured
                  ? "bg-white/20 text-white"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              )}
            >
              Save {yearlyDiscount}%
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {showFeatureComparison && tier.features && (
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, idx) => (
            <li
              key={idx}
              className={cn(
                "flex items-start gap-3 text-sm",
                feature.included
                  ? tier.featured
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300"
                  : tier.featured
                  ? "text-violet-300 line-through"
                  : "text-slate-400 line-through"
              )}
            >
              {feature.included ? (
                <Check
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    tier.featured ? "text-emerald-300" : "text-emerald-500"
                  )}
                />
              ) : (
                <X
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    tier.featured ? "text-violet-400" : "text-slate-300"
                  )}
                />
              )}
              <span className={feature.highlight ? "font-medium" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <button
        className={cn(
          "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200",
          tier.featured
            ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
            : tier.ctaVariant === "outline"
            ? "border-2 border-violet-500 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
            : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        )}
      >
        {tier.ctaText}
      </button>
    </motion.div>
  );
}

export function PricingTable(props: PricingTableProps) {
  const validatedProps = pricingTablePropsSchema.parse(props);

  const {
    headline,
    subheadline,
    tiers,
    showBillingToggle = false,
    yearlyDiscount,
    defaultBilling = "monthly",
    showFeatureComparison = true,
    compact = false,
    faqItems,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const [isYearly, setIsYearly] = useState(defaultBilling === "yearly");

  return (
    <section
      className={cn("py-16", className)}
      id={id}
      aria-label={ariaLabel || "Pricing"}
      data-testid={dataTestId}
    >
      {/* Header */}
      {(headline || subheadline) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {headline && (
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {headline}
            </h2>
          )}
          {subheadline && (
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </motion.div>
      )}

      {/* Billing Toggle */}
      {showBillingToggle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={cn(
              "relative w-14 h-7 rounded-full transition-colors",
              isYearly ? "bg-violet-600" : "bg-slate-200 dark:bg-slate-700"
            )}
            role="switch"
            aria-checked={isYearly}
          >
            <span
              className={cn(
                "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform",
                isYearly ? "translate-x-7" : "translate-x-0.5"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"
            )}
          >
            Yearly
            {yearlyDiscount && (
              <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                (Save {yearlyDiscount}%)
              </span>
            )}
          </span>
        </motion.div>
      )}

      {/* Pricing Tiers */}
      <div
        className={cn(
          "grid gap-6 max-w-6xl mx-auto",
          tiers.length === 1 && "max-w-md",
          tiers.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-3xl",
          tiers.length === 3 && "grid-cols-1 md:grid-cols-3",
          tiers.length >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {tiers.map((tier, index) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isYearly={isYearly}
            yearlyDiscount={yearlyDiscount}
            showFeatureComparison={showFeatureComparison}
            index={index}
          />
        ))}
      </div>

      {/* FAQ Section */}
      {faqItems && faqItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-slate-900 dark:text-white">
                  {item.question}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

PricingTable.displayName = "PricingTable";
