import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, MessageSquare, Ship, Users, Ruler, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Yacht, Locale } from "../types";
import { translations } from "../data/translations";

interface YachtCardProps {
  key?: string;
  yacht: Yacht;
  lang: Locale;
  selectedMonth: string; // e.g. 'may', 'june', etc.
  onBookClick: (yacht: Yacht) => void;
}

export default function YachtCard({ yacht, lang, selectedMonth, onBookClick }: YachtCardProps) {
  const t = translations[lang];
  const cardRef = useRef<HTMLDivElement>(null);

  // Carousel state
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // 3D Tilt states
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Expandable specs state
  const [showInclusions, setShowInclusions] = useState(false);

  // Determine pricing season & active value based on the selected month
  const getActiveSeasonInfo = () => {
    switch (selectedMonth) {
      case "july":
      case "august":
        return {
          rate: yacht.pricing.highSeason,
          label: t.highSeason,
          seasonKey: "high"
        };
      case "june":
      case "september":
        return {
          rate: yacht.pricing.midSeason,
          label: t.midSeason,
          seasonKey: "mid"
        };
      case "may":
      case "october":
      default:
        return {
          rate: yacht.pricing.lowSeason,
          label: t.lowSeason,
          seasonKey: "low"
        };
    }
  };

  const { rate, label: activeSeasonLabel, seasonKey } = getActiveSeasonInfo();

  // Handle image advancement
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? yacht.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === yacht.images.length - 1 ? 0 : prev + 1));
  };

  // Modern 3D Tilt logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to the card container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation angles (max tilt 10 degrees)
    const rotateY = ((mouseX / width) - 0.5) * 12;
    const rotateX = -((mouseY / height) - 0.5) * 12;

    setTilt({ x: rotateX, y: rotateY });

    // Sheen reflection position
    const sheenX = (mouseX / width) * 100;
    const sheenY = (mouseY / height) * 100;
    setSheen({ x: sheenX, y: sheenY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50 });
  };

  // Fetch localized inclusions & exclusions lists
  const localizedIncluded = yacht.included[lang] || yacht.included["EN"] || [];
  const localizedExcluded = yacht.excluded[lang] || yacht.excluded["EN"] || [];

  return (
    <motion.div
      id={`yacht-card-${yacht.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.025)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        boxShadow: isHovered
          ? "0 30px 60px -15px rgba(184, 169, 122, 0.15)"
          : "0 10px 30px -10px rgba(184, 169, 122, 0.05)"
      }}
      className="relative flex flex-col bg-white border-[0.5px] border-[#B8A97A]/25 overflow-hidden group transition-all duration-300 rounded-none w-full"
    >
      {/* 3D Sheen satin gloss sheet overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 65%)`
        }}
      />

      {/* Image Carousel Block */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-900 select-none">
        
        {/* Vessel Tag */}
        <div className="absolute top-3 left-3 z-20 bg-[#0A0A0A] px-2.5 py-1.5 text-[8px] tracking-[0.3em] text-[#fdfbf7] uppercase font-light font-sans">
          {yacht.type.toUpperCase( )}
        </div>

        {/* Carousel buttons */}
        <button
          id={`carousel-prev-${yacht.id}`}
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/95 p-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all rounded-none hover:scale-105"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          id={`carousel-next-${yacht.id}`}
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/95 p-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all rounded-none hover:scale-105"
        >
          <ChevronRight size={16} />
        </button>

        {/* Carousel Images */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImgIndex}
            src={yacht.images[activeImgIndex]}
            alt={`${yacht.brand} ${yacht.name} view`}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0.1, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.1, scale: 0.95 }}
            transition={{ duration: 0.45 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
          {yacht.images.map((_, index) => (
            <button
              key={index}
              id={`carousel-indicator-${yacht.id}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImgIndex(index);
              }}
              className={`h-1.5 transition-all ${
                index === activeImgIndex ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Details and metrics */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Name */}
          <div className="mb-3">
            <span className="text-[8px] sm:text-[9.5px] tracking-[0.45em] text-[#B8A97A] uppercase font-light block mb-1">
              {yacht.brand}
            </span>
            <h3 className="font-display font-light text-xl sm:text-2xl text-[#0A0A0A] leading-tight uppercase tracking-[0.22em]">
              {yacht.name}
            </h3>
          </div>

          {/* Double Metrics Always Visible (Metres and Feet simultaneously) with elegant 0.5pt dividers */}
          <div className="grid grid-cols-2 gap-2 border-y border-[0.5px] border-[#B8A97A]/15 py-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Ruler size={13} className="text-[#B8A97A]" />
              <div className="flex flex-col">
                <span className="text-[7.5px] tracking-[0.25em] text-neutral-400 uppercase font-light">Length</span>
                <span className="text-[10px] font-medium text-neutral-800 font-mono">
                  {yacht.sizeMeters} {t.meters.substring(0, 1)} / {yacht.sizeFeet} {t.feet.substring(0, 2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-[#B8A97A]" />
              <div className="flex flex-col">
                <span className="text-[7.5px] tracking-[0.25em] text-neutral-400 uppercase font-light">Guests</span>
                <span className="text-[10px] font-medium text-neutral-800 font-mono">
                  {t.maxPeople.replace("{count}", yacht.maxGuests.toString())}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing tier dynamic highlighting table on soft cream alt background */}
          <div className="mb-4 bg-[#F4F4F2]/70 p-3 border-[0.5px] border-[#B8A97A]/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] tracking-[0.25em] text-[#0A0A0A] uppercase font-light">
                {t.monthSelect.toUpperCase( )}: <span className="text-[#B8A97A] font-normal">{selectedMonth.toUpperCase()}</span>
              </span>
              <span className="text-[7px] uppercase font-light text-neutral-400 block tracking-widest">
                {t.vatExcluded}
              </span>
            </div>
            
            {/* Rates comparison tags */}
            <div className="grid grid-cols-3 gap-1 text-center">
              <div
                className={`p-1.5 border-[0.5px] transition-all rounded-none ${
                  seasonKey === "low"
                    ? "bg-[#0A0A0A] border-[#0A0A0A] text-[#fdfbf7] scale-[1.03] font-normal"
                    : "bg-white border-[#B8A97A]/20 text-neutral-500 font-light"
                }`}
              >
                <div className="text-[6.5px] uppercase tracking-widest block opacity-75">Low</div>
                <div className="text-[9px] font-mono">€{yacht.pricing.lowSeason.toLocaleString()}</div>
              </div>

              <div
                className={`p-1.5 border-[0.5px] transition-all rounded-none ${
                  seasonKey === "mid"
                    ? "bg-[#0A0A0A] border-[#0A0A0A] text-[#fdfbf7] scale-[1.03] font-normal"
                    : "bg-white border-[#B8A97A]/20 text-neutral-500 font-light"
                }`}
              >
                <div className="text-[7px] uppercase tracking-widest block">Mid</div>
                <div className="text-[10px] font-mono font-extrabold">€{yacht.pricing.midSeason.toLocaleString()}</div>
              </div>

              <div
                className={`p-1.5 border-[0.5px] transition-all rounded-none ${
                  seasonKey === "high"
                    ? "bg-[#0A0A0A] border-[#0A0A0A] text-[#fdfbf7] scale-[1.03] font-normal"
                    : "bg-white border-[#B8A97A]/20 text-neutral-500 font-light"
                }`}
              >
                <div className="text-[6.5px] uppercase tracking-widest block opacity-75">High</div>
                <div className="text-[9px] font-mono">€{yacht.pricing.highSeason.toLocaleString()}</div>
              </div>
            </div>

            {/* Live highlighted rate */}
            <div className="mt-2.5 pt-2 border-t border-dashed border-[#B8A97A]/25 flex items-center justify-between">
              <span className="text-[9px] tracking-[0.15em] text-[#0A0A0A] font-light uppercase">
                {t.pricePerDay}
              </span>
              <span className="text-sm font-normal font-sans text-[#0A0A0A] tracking-wider">
                €{rate.toLocaleString()} <span className="text-[9px] font-light text-[#B8A97A]">/ day</span>
              </span>
            </div>
          </div>

          {/* Interactive Inclusions / Exclusions accordion */}
          <div className="mb-4">
            <button
              id={`specs-accordion-btn-${yacht.id}`}
              onClick={() => setShowInclusions(!showInclusions)}
              className="w-full text-left py-1.5 text-[9px] tracking-[0.2em] font-light uppercase text-[#B8A97A] border-b border-[#B8A97A]/15 hover:text-[#0A0A0A] flex justify-between items-center transition-colors cursor-pointer"
            >
              <span>{showInclusions ? t.showLess : t.showMore}</span>
              <span>{showInclusions ? "—" : "+"}</span>
            </button>

            <AnimatePresence>
              {showInclusions && (
                <motion.div
                  id={`specs-details-box-${yacht.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3 space-y-3"
                >
                  {/* Included list */}
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block mb-1">
                      {t.includedTitle}
                    </span>
                    <ul className="grid grid-cols-1 gap-1">
                      {localizedIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[10px] font-medium text-neutral-700">
                          <CheckCircle2 size={11} className="text-black shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded list */}
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block mb-1">
                      {t.excludedTitle}
                    </span>
                    <ul className="grid grid-cols-1 gap-1">
                      {localizedExcluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[10px] font-medium text-neutral-750">
                          <AlertCircle size={11} className="text-neutral-450 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action WhatsApp book trigger & discreet Class code */}
        <div className="pt-2 border-t border-[#B8A97A]/15 flex flex-col gap-2.5">
          {/* Booking Trigger */}
          <button
            id={`book-btn-${yacht.id}`}
            onClick={() => onBookClick(yacht)}
            className="w-full bg-[#0A0A0A] hover:bg-[#1a2744] border-[0.5px] border-[#0A0A0A] text-white font-sans text-[8.5px] font-light tracking-[0.45em] py-3.5 uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-none cursor-pointer"
          >
            <MessageSquare size={12} className="text-[#B8A97A] shrink-0" />
            <span>{t.bookWhatsApp}</span>
          </button>

          {/* Discreet inner charter tracking code (Masked elegantly) */}
          <div className="flex items-center justify-between text-[7.5px] text-neutral-400 tracking-[0.25em] uppercase font-mono font-medium">
            <span>REG ID / METADATA</span>
            <span className="font-bold cursor-help hover:text-[#B8A97A] transition-colors" title="Charter Registry Reference Code">
              {yacht.charterCode}—SMART
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
