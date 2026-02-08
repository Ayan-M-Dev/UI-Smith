"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type TestimonialSectionProps,
  type Testimonial,
  testimonialSectionPropsSchema,
} from "@/schemas/testimonial-section.schema";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

/**
 * Testimonial Section Component
 * =============================
 * A versatile testimonial/review section with multiple layouts.
 */

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          )}
        />
      ))}
    </div>
  );
}

// Individual Testimonial Card
function TestimonialCard({
  testimonial,
  cardStyle,
  showRatings,
  showAvatars,
  showCompanyLogos,
  showDates,
  showQuoteMarks,
  quoteMarkStyle,
  index,
}: {
  testimonial: Testimonial;
  cardStyle: string;
  showRatings: boolean;
  showAvatars: boolean;
  showCompanyLogos: boolean;
  showDates: boolean;
  showQuoteMarks: boolean;
  quoteMarkStyle: string;
  index: number;
}) {
  const cardClasses = {
    elevated:
      "bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border-0",
    outlined:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
    minimal: "bg-transparent",
    gradient:
      "bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 border border-violet-200/30 dark:border-violet-700/20",
  };

  const quoteMarkStyles = {
    classic: "text-6xl font-serif text-violet-200 dark:text-violet-800",
    modern: "text-4xl text-violet-500/30",
    minimal: "hidden",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative p-6 rounded-2xl transition-all duration-300 hover:shadow-xl",
        cardClasses[cardStyle as keyof typeof cardClasses]
      )}
    >
      {/* Quote Mark */}
      {showQuoteMarks && quoteMarkStyle !== "minimal" && (
        <div className="absolute top-4 left-4">
          {quoteMarkStyle === "classic" ? (
            <span className={quoteMarkStyles.classic}>"</span>
          ) : (
            <Quote className={quoteMarkStyles.modern} />
          )}
        </div>
      )}

      {/* Featured Image */}
      {testimonial.imageUrl && (
        <div className="mb-4 -mx-6 -mt-6">
          <img
            src={testimonial.imageUrl}
            alt=""
            className="w-full h-32 object-cover rounded-t-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn(showQuoteMarks && quoteMarkStyle === "classic" && "pt-8")}>
        {/* Rating */}
        {showRatings && testimonial.rating && (
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
        )}

        {/* Quote */}
        <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          "{testimonial.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {showAvatars && (
            <div className="shrink-0">
              {testimonial.authorAvatarUrl ? (
                <img
                  src={testimonial.authorAvatarUrl}
                  alt={testimonial.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {testimonial.authorName.charAt(0)}
                </div>
              )}
            </div>
          )}

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-white truncate">
              {testimonial.authorName}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {testimonial.authorRole && (
                <span className="truncate">{testimonial.authorRole}</span>
              )}
              {testimonial.authorRole && testimonial.authorCompany && (
                <span className="text-slate-300 dark:text-slate-600">•</span>
              )}
              {testimonial.authorCompany && (
                <span className="truncate">{testimonial.authorCompany}</span>
              )}
            </div>
          </div>

          {/* Company Logo */}
          {showCompanyLogos && testimonial.logoUrl && (
            <img
              src={testimonial.logoUrl}
              alt={testimonial.authorCompany || "Company"}
              className="shrink-0 h-8 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Date */}
          {showDates && testimonial.date && (
            <span className="text-xs text-slate-400">{testimonial.date}</span>
          )}

          {/* Source */}
          {testimonial.source && (
            <a
              href={testimonial.sourceUrl || "#"}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors"
            >
              {testimonial.source}
              {testimonial.sourceUrl && <ExternalLink className="w-3 h-3" />}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Carousel Navigation
function CarouselNav({
  onPrev,
  onNext,
  currentIndex,
  total,
  showDots,
  showArrows,
}: {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  showDots: boolean;
  showArrows: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {showArrows && (
        <button
          onClick={onPrev}
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      )}

      {showDots && (
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, index) => (
            <button
              key={index}
              onClick={() => {}}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-6 bg-violet-600"
                  : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {showArrows && (
        <button
          onClick={onNext}
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      )}
    </div>
  );
}

export function TestimonialSection(props: TestimonialSectionProps) {
  const validatedProps = testimonialSectionPropsSchema.parse(props);

  const {
    headline,
    subheadline,
    testimonials,
    layout = "grid",
    columns = 3,
    showRatings = true,
    showAvatars = true,
    showCompanyLogos = false,
    showDates = false,
    autoplay = false,
    autoplayInterval = 5000,
    showDots = true,
    showArrows = true,
    cardStyle = "elevated",
    showQuoteMarks = true,
    quoteMarkStyle = "modern",
    animateOnScroll = true,
    staggerAnimation = true,
    showStats = false,
    stats,
    showCta = false,
    ctaText = "See all reviews",
    ctaHref,
    className,
    id,
    "aria-label": ariaLabel,
    "data-testid": dataTestId,
  } = validatedProps;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto-play for carousel
  React.useEffect(() => {
    if (layout !== "carousel" || !autoplay) return;

    const interval = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [layout, autoplay, autoplayInterval]);

  // Grid columns class
  const gridColumnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section
      className={cn("py-16 px-4", className)}
      id={id}
      aria-label={ariaLabel || "Testimonials"}
      data-testid={dataTestId}
    >
      <div className="max-w-7xl mx-auto">
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

        {/* Stats */}
        {showStats && stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Testimonials */}
        {layout === "carousel" ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="max-w-2xl mx-auto"
              >
                <TestimonialCard
                  testimonial={testimonials[currentIndex]}
                  cardStyle={cardStyle}
                  showRatings={showRatings}
                  showAvatars={showAvatars}
                  showCompanyLogos={showCompanyLogos}
                  showDates={showDates}
                  showQuoteMarks={showQuoteMarks}
                  quoteMarkStyle={quoteMarkStyle}
                  index={0}
                />
              </motion.div>
            </AnimatePresence>

            <CarouselNav
              onPrev={goToPrev}
              onNext={goToNext}
              currentIndex={currentIndex}
              total={testimonials.length}
              showDots={showDots}
              showArrows={showArrows}
            />
          </div>
        ) : layout === "featured" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Featured testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:row-span-2"
            >
              <TestimonialCard
                testimonial={testimonials.find((t) => t.featured) || testimonials[0]}
                cardStyle={cardStyle}
                showRatings={showRatings}
                showAvatars={showAvatars}
                showCompanyLogos={showCompanyLogos}
                showDates={showDates}
                showQuoteMarks={showQuoteMarks}
                quoteMarkStyle={quoteMarkStyle}
                index={0}
              />
            </motion.div>
            {/* Other testimonials */}
            <div className="space-y-6">
              {testimonials
                .filter((t) => !t.featured)
                .slice(0, 2)
                .map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    cardStyle={cardStyle}
                    showRatings={showRatings}
                    showAvatars={showAvatars}
                    showCompanyLogos={showCompanyLogos}
                    showDates={showDates}
                    showQuoteMarks={showQuoteMarks}
                    quoteMarkStyle={quoteMarkStyle}
                    index={index + 1}
                  />
                ))}
            </div>
          </div>
        ) : layout === "quotes" ? (
          <div className="max-w-4xl mx-auto text-center">
            {testimonials.slice(0, 1).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {showQuoteMarks && (
                  <Quote className="w-12 h-12 mx-auto mb-6 text-violet-500/30" />
                )}
                <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  {showAvatars && (
                    <img
                      src={testimonial.authorAvatarUrl || ""}
                      alt={testimonial.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.authorName}
                    </p>
                    <p className="text-slate-500">
                      {testimonial.authorRole}
                      {testimonial.authorCompany && ` at ${testimonial.authorCompany}`}
                    </p>
                  </div>
                </div>
                {showRatings && testimonial.rating && (
                  <div className="flex justify-center mt-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // Grid layout (default)
          <div
            className={cn(
              "grid gap-6",
              gridColumnsClass[columns as keyof typeof gridColumnsClass] || gridColumnsClass[3]
            )}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                cardStyle={cardStyle}
                showRatings={showRatings}
                showAvatars={showAvatars}
                showCompanyLogos={showCompanyLogos}
                showDates={showDates}
                showQuoteMarks={showQuoteMarks}
                quoteMarkStyle={quoteMarkStyle}
                index={index}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <a
              href={ctaHref || "#"}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 transition-colors"
            >
              {ctaText}
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

TestimonialSection.displayName = "TestimonialSection";
