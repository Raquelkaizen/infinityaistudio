import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, FilterX, HelpCircle, Anchor } from "lucide-react";
import { Locale, Yacht } from "./types";
import fleetData from "./data/fleet.json";

// Import custom sections
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchFilters from "./components/SearchFilters";
import YachtCard from "./components/YachtCard";
import Testimonials from "./components/Testimonials";
import ContactModal from "./components/ContactModal";

import { translations } from "./data/translations";

export default function App() {
  const fleet: Yacht[] = fleetData as Yacht[];

  // App core states
  const [lang, setLang] = useState<Locale>("EN");
  const [selectedMonth, setSelectedMonth] = useState<string>("july"); // Default July (High season)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [sizeCategory, setSizeCategory] = useState<string>("All");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("All");
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(6500);
  const [sortByRule, setSortByRule] = useState<string>("price-desc");

  // Contact modal triggers
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [prefilledYacht, setPrefilledYacht] = useState<Yacht | null>(null);

  const t = translations[lang];

  // Ref to catalog grid for smooth scroll when clicking Hero CTA
  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenCuriousMain = () => {
    setPrefilledYacht(null);
    setIsModalOpen(true);
  };

  const handleOpenCuriousBoat = (yacht: Yacht) => {
    setPrefilledYacht(yacht);
    setIsModalOpen(true);
  };

  // Helper to compute active rate based on selected month
  const getComputedRate = (yacht: Yacht, month: string): number => {
    switch (month) {
      case "july":
      case "august":
        return yacht.pricing.highSeason;
      case "june":
      case "september":
        return yacht.pricing.midSeason;
      case "may":
      case "october":
      default:
        return yacht.pricing.lowSeason;
    }
  };

  // Reset helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedMonth("july");
    setSelectedType("All");
    setSizeCategory("All");
    setSelectedCapacity("All");
    setMaxPriceLimit(6500);
    setSortByRule("price-desc");
  };

  // Live filtered and sorted fleet list
  const processedFleet = useMemo(() => {
    let list = [...fleet];

    // Filter 1: Universal search text query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const brandMatch = item.brand.toLowerCase().includes(q);
        const typeMatch = item.type.toLowerCase().includes(q);
        
        // Search in inclusions list matching language or English
        const specListIncl = item.included[lang] || item.included["EN"] || [];
        const incMatch = specListIncl.some((i) => i.toLowerCase().includes(q));

        return nameMatch || brandMatch || typeMatch || incMatch;
      });
    }

    // Filter 2: Vessel Type
    if (selectedType !== "All") {
      list = list.filter((item) => item.type === selectedType);
    }

    // Filter 3: Vessel physical Length category
    if (sizeCategory !== "All") {
      if (sizeCategory === "small") {
        list = list.filter((item) => item.sizeMeters < 15);
      } else if (sizeCategory === "medium") {
        list = list.filter((item) => item.sizeMeters >= 15 && item.sizeMeters <= 20);
      } else if (sizeCategory === "large") {
        list = list.filter((item) => item.sizeMeters > 20);
      }
    }

    // Filter 4: Capacity Constraint (minimum guests fitted)
    if (selectedCapacity !== "All") {
      const targetMin = parseInt(selectedCapacity, 10);
      list = list.filter((item) => item.maxGuests >= targetMin);
    }

    // Filter 5: Dynamic seasonal pricing ceiling
    list = list.filter((item) => {
      const activeRate = getComputedRate(item, selectedMonth);
      return activeRate <= maxPriceLimit;
    });

    // Sorting rule mapping
    list.sort((a, b) => {
      const rateA = getComputedRate(a, selectedMonth);
      const rateB = getComputedRate(b, selectedMonth);

      if (sortByRule === "price-asc") {
        return rateA - rateB;
      } else if (sortByRule === "price-desc") {
        return rateB - rateA;
      } else if (sortByRule === "size-desc") {
        return b.sizeMeters - a.sizeMeters;
      } else if (sortByRule === "size-asc") {
        return a.sizeMeters - b.sizeMeters;
      }
      return 0;
    });

    return list;
  }, [fleet, lang, searchQuery, selectedType, sizeCategory, selectedCapacity, selectedMonth, maxPriceLimit, sortByRule]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#0A0A0A] font-sans selection:bg-[#0A0A0A] selection:text-[#fdfbf7]" id="main-app-container">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        onOpenCurious={handleOpenCuriousMain}
      />

      {/* 2. Full-Width Editorial Hero Banner */}
      <Hero
        lang={lang}
        onExploreClick={scrollToCatalog}
      />

      {/* 3. Horizontal Modular Search Filter & Sorter */}
      <div ref={catalogRef} className="scroll-mt-6">
        <SearchFilters
          lang={lang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          maxPriceLimit={maxPriceLimit}
          setMaxPriceLimit={setMaxPriceLimit}
          sizeCategory={sizeCategory}
          setSizeCategory={setSizeCategory}
          selectedCapacity={selectedCapacity}
          setSelectedCapacity={setSelectedCapacity}
          sortByRule={sortByRule}
          setSortByRule={setSortByRule}
          resetAllFilters={handleResetFilters}
        />
      </div>

      {/* 4. Luxury Catalog Grid */}
      <main className="py-12 px-4 sm:px-8 max-w-7xl mx-auto" id="gallery-catalog">
        
        {/* Gallery context info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-neutral-400 font-bold block uppercase mb-1">
              CURRENT CONSTRAINTS
            </span>
            <p className="text-xs text-neutral-650 font-light uppercase tracking-wider">
              Showing <span className="font-extrabold text-black">{processedFleet.length}</span> of <span className="font-semibold">{fleet.length}</span> elite vessels. Month: <span className="font-semibold text-black uppercase">{selectedMonth}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-500 font-light">
            <Sparkles size={11} className="text-black" />
            <span>Interactive 3D Tilt is active. Hover cards to preview sheen.</span>
          </div>
        </div>

        {/* Dynamic content area */}
        <AnimatePresence mode="popLayout">
          {processedFleet.length === 0 ? (
            <motion.div
              id="no-results-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-16 px-6 text-center border border-dashed border-neutral-200 mt-4 flex flex-col items-center max-w-lg mx-auto"
            >
              <FilterX className="text-neutral-300 h-10 w-10 mb-4 stroke-[1.2]" />
              <p className="text-xs text-neutral-500 font-light leading-relaxed mb-6">
                {t.noResults}
              </p>
              <button
                id="reset-no-results-btn"
                onClick={handleResetFilters}
                className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] tracking-widest uppercase px-6 py-2.5 transition-all"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            /* Fleet catalog grid with glide reordering layout animation */
            <motion.div
              layout
              id="yachts-grid-layout"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {processedFleet.map((yacht) => (
                <YachtCard
                  key={yacht.id}
                  yacht={yacht}
                  lang={lang}
                  selectedMonth={selectedMonth}
                  onBookClick={handleOpenCuriousBoat}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 5. Editorial Testimonials Block */}
      <Testimonials lang={lang} />

      {/* 6. Footer Signature */}
      <footer className="bg-[#0A0A0A] text-[#fdfbf7] py-16 px-4 sm:px-8 border-t border-[#B8A97A]/20" id="main-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="text-[#B8A97A] stroke-[1.5] h-5 w-5" />
              <div className="flex flex-col">
                <span className="font-display font-light tracking-[0.26em] text-white text-base">
                  INFINITY
                </span>
                <span className="font-sans text-[8px] tracking-[0.36em] text-[#B8A97A] font-light uppercase">
                  BOATS IBIZA
                </span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-light max-w-sm leading-relaxed mb-6 uppercase tracking-wider">
              Curators of the world's finest marine voyages. Proudly establishing bespoke daily rentals and seasonal voyages matching the absolute highest level of Swiss and European maritime standards.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] text-white uppercase font-bold mb-4">
              EXPERIENCES
            </h4>
            <ul className="space-y-2 text-[10px] tracking-widest uppercase font-semibold text-neutral-450">
              <li><span className="hover:text-white cursor-pointer transition-colors">Day Charters</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Overnight Cruises</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Ibiza Elite Route</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Corporate Charters</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] text-white uppercase font-bold mb-4">
              LOCATIONS
            </h4>
            <span className="block text-[10px] text-neutral-400 font-semibold tracking-widest uppercase mb-1">
              MARINA IBIZA • SPAIN
            </span>
            <span className="block text-[9px] text-neutral-500 font-light uppercase tracking-wider">
              Oficina Central – Paseo Juan Carlos I
            </span>
            <span className="block text-[9px] text-neutral-500 font-light uppercase tracking-wider">
              07800 Ibiza, Baleares
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
          <span>© 2026 INFINITY BOATS IBIZA SL. ALL RIGHTS RESERVED.</span>
          <span>CURATED IN COOPERATION WITH SMART CHARTERS</span>
        </div>
      </footer>

      {/* Interactive Bespoke Reservation Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        prefilledYacht={prefilledYacht}
        fleet={fleet}
      />
    </div>
  );
}
