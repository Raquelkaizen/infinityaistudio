import React from "react";
import { motion } from "motion/react";
import { Compass, Star } from "lucide-react";
import { Locale } from "../types";
import { translations } from "../data/translations";

interface TestimonialsProps {
  lang: Locale;
}

export default function Testimonials({ lang }: TestimonialsProps) {
  const t = translations[lang];

  return (
    <section className="bg-[#fdfbf7] text-[#0A0A0A] py-16 px-4 sm:px-8 border-t border-[#B8A97A]/15" id="testimonials-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Section title header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Compass className="text-[#B8A97A] h-4 w-4 animate-spin-slow stroke-[1.2]" />
            <span className="text-[8px] sm:text-[9px] tracking-[0.45em] text-[#B8A97A] uppercase font-light">
              GUEST LOGBOOKS
            </span>
          </div>
          <h2 className="font-display font-light text-2xl sm:text-3xl tracking-[0.22em] text-[#0A0A0A] uppercase">
            {t.testimonialsTitle}
          </h2>
          <div className="h-[1px] w-12 bg-[#B8A97A] mx-auto mt-4" />
        </div>

        {/* Dynamic testimonial block cards mapping to translations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonialList.map((test, idx) => (
            <motion.div
              key={idx}
              id={`testimonial-index-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white border-[0.5px] border-[#B8A97A]/20 p-6 md:p-8 flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(184,169,122,0.08)] rounded-none relative"
            >
              {/* Star indicators */}
              <div className="flex gap-1 mb-4 text-[#B8A97A]">
                {[...Array(5)].map((_, starIdx) => (
                  <Star key={starIdx} size={11} className="fill-[#B8A97A] stroke-[#B8A97A]" />
                ))}
              </div>

              {/* Quote description */}
              <p className="text-neutral-700 italic text-[11px] sm:text-xs leading-relaxed mb-6 font-light">
                "{test.quote}"
              </p>

              {/* Author specs */}
              <div className="border-t border-[0.5px] border-[#B8A97A]/15 pt-4 mt-auto">
                <span className="block font-sans font-medium text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]">
                  {test.author}
                </span>
                <span className="block text-[8px] tracking-[0.3em] text-[#B8A97A] uppercase font-light mt-0.5">
                  {test.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Corporate tagline credentials */}
        <div className="mt-12 text-center text-[8px] sm:text-[9px] tracking-[0.35em] text-[#B8A97A] uppercase font-light">
          PROUDLY PARTNERED WITH SMART CHARTERS IBIZA REGIONAL OFFICE • EST. 2012
        </div>

      </div>
    </section>
  );
}
