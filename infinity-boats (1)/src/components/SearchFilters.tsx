import React from "react";
import { Search, SlidersHorizontal, CalendarDays, ArrowUpDown, RefreshCw, Layers } from "lucide-react";
import { Locale } from "../types";
import { translations } from "../data/translations";

interface SearchFiltersProps {
  lang: Locale;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedMonth: string; // 'may' | 'june' | 'july' | 'august' | 'september' | 'october'
  setSelectedMonth: (val: string) => void;
  selectedType: string; // 'All' | 'Yacht' | 'Superyacht' | 'Catamaran' | 'Cruiser'
  setSelectedType: (val: string) => void;
  maxPriceLimit: number;
  setMaxPriceLimit: (val: number) => void;
  sizeCategory: string; // 'All' | 'small' (under 15m) | 'medium' (15m-20m) | 'large' (over 20m)
  setSizeCategory: (val: string) => void;
  selectedCapacity: string; // 'All' | '8' | '10' | '12'
  setSelectedCapacity: (val: string) => void;
  sortByRule: string; // 'price-asc' | 'price-desc' | 'size-desc' | 'size-asc'
  setSortByRule: (val: string) => void;
  resetAllFilters: () => void;
}

export default function SearchFilters({
  lang,
  searchQuery,
  setSearchQuery,
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
  maxPriceLimit,
  setMaxPriceLimit,
  sizeCategory,
  setSizeCategory,
  selectedCapacity,
  setSelectedCapacity,
  sortByRule,
  setSortByRule,
  resetAllFilters
}: SearchFiltersProps) {
  const t = translations[lang];

  // List of months and which season pricing category they map to
  const months = [
    { value: "may", label: lang === "ES" ? "Mayo" : lang === "NL" ? "Mei" : lang === "FR" ? "Mai" : lang === "IT" ? "Maggio" : "May", season: "low" },
    { value: "june", label: lang === "ES" ? "Junio" : lang === "NL" ? "Juni" : lang === "FR" ? "Juin" : lang === "IT" ? "Giugno" : "June", season: "mid" },
    { value: "july", label: lang === "ES" ? "Julio" : lang === "NL" ? "Juli" : lang === "FR" ? "Juillet" : lang === "IT" ? "Luglio" : "July", season: "high" },
    { value: "august", label: lang === "ES" ? "Agosto" : lang === "NL" ? "Augustus" : lang === "FR" ? "Août" : lang === "IT" ? "Agosto" : "August", season: "high" },
    { value: "september", label: lang === "ES" ? "Septiembre" : lang === "NL" ? "September" : lang === "FR" ? "Septembre" : lang === "IT" ? "Settembre" : "September", season: "mid" },
    { value: "october", label: lang === "ES" ? "Octubre" : lang === "NL" ? "Oktober" : lang === "FR" ? "Octobre" : lang === "IT" ? "Ottobre" : "October", season: "low" }
  ];

  const types = ["All", "Superyacht", "Yacht", "Catamaran", "Cruiser"];
  const capacities = ["All", "8", "10", "12"];
  const sizeCategories = [
    { value: "All", label_en: "All Sizes", label_es: "Todos", label_nl: "Alle maten", label_fr: "Toutes tailles", label_it: "Tutte le taglie" },
    { value: "small", label_en: "< 15m (< 49ft)", label_es: "< 15m (< 49ft)", label_nl: "< 15m (< 49ft)", label_fr: "< 15m (< 49ft)", label_it: "< 15m (< 49ft)" },
    { value: "medium", label_en: "15m - 20m (50ft - 65ft)", label_es: "15m a 20m (50 a 65 pies)", label_nl: "15m - 20m (50 - 65ft)", label_fr: "15m - 20m (50 - 65ft)", label_it: "15m - 20m (50 - 65ft)" },
    { value: "large", label_en: "> 20m (> 65ft)", label_es: "> 20m (> 65 pies)", label_nl: "> 20m (> 65ft)", label_fr: "> 20m (> 65ft)", label_it: "> 20m (> 65ft)" }
  ];

  const getSizeLabel = (val: string) => {
    const found = sizeCategories.find((s) => s.value === val);
    if (!found) return "";
    if (lang === "ES") return found.label_es;
    if (lang === "NL") return found.label_nl;
    if (lang === "FR") return found.label_fr;
    if (lang === "IT") return found.label_it;
    return found.label_en;
  };
  return (
    <div className="bg-[#F4F4F2]/50 text-[#0A0A0A] p-6 sm:p-8 border-b border-[#B8A97A]/20" id="search-filters-bar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">

          {/* Title and reset option */}
          <div className="flex items-center justify-between border-b border-[#B8A97A]/15 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#B8A97A]" />
              <h2 className="font-sans font-medium text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#0A0A0A]">
                {t.filterTitle}
              </h2>
            </div>
            
            <button
              id="reset-filters-btn"
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 text-[#B8A97A] hover:text-[#0A0A0A] transition-colors text-[10px] tracking-[0.2em] uppercase font-light cursor-pointer"
            >
              <RefreshCw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-450 h-4 w-4" />
            <input
              id="filter-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#fdfbf7] hover:bg-[#fdfbf7]/80 focus:bg-[#fdfbf7] text-[#0A0A0A] text-xs pl-10 pr-4 py-3.5 border-[0.5px] border-[#B8A97A]/25 focus:outline-none focus:border-[#B8A97A] rounded-none transition-all placeholder:text-neutral-400 placeholder:font-light tracking-wide"
            />
          </div>

          {/* Advanced Multi-Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* 1. Dynamic Season Trigger: Calendar Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-light text-[#B8A97A]">
                <CalendarDays size={12} className="text-[#B8A97A]" />
                <span>{t.monthSelect}</span>
              </label>
              
              <div className="grid grid-cols-3 gap-1 bg-[#fdfbf7] p-1 border-[0.5px] border-[#B8A97A]/25">
                {months.map((m) => (
                  <button
                    key={m.value}
                    id={`month-btn-${m.value}`}
                    onClick={() => setSelectedMonth(m.value)}
                    className={`py-1.5 text-[9px] tracking-wider font-light uppercase text-center transition-all cursor-pointer ${
                      selectedMonth === m.value
                        ? "bg-[#0A0A0A] text-[#fdfbf7]"
                        : "text-neutral-500 hover:text-[#0A0A0A]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Vessel Type Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-light text-[#B8A97A]">
                Vessel Type
              </label>
              <select
                id="filter-type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#fdfbf7] px-3 py-[10px] border-[0.5px] border-[#B8A97A]/25 text-[10px] tracking-[0.15em] uppercase font-light focus:outline-none focus:border-[#B8A97A] rounded-none appearance-none cursor-pointer text-neutral-800"
              >
                {types.map((v) => (
                  <option key={v} value={v}>
                    {v === "All" ? t.allTypes : v.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Vessel Size Categorization */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-light text-[#B8A97A]">
                Specifications: Size
              </label>
              <select
                id="filter-size-select"
                value={sizeCategory}
                onChange={(e) => setSizeCategory(e.target.value)}
                className="w-full bg-[#fdfbf7] px-3 py-[10px] border-[0.5px] border-[#B8A97A]/25 text-[10px] tracking-[0.15em] uppercase font-light focus:outline-none focus:border-[#B8A97A] rounded-none appearance-none cursor-pointer text-neutral-800"
              >
                {sizeCategories.map((sc) => (
                  <option key={sc.value} value={sc.value}>
                    {getSizeLabel(sc.value)}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Guest Capacity */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-light text-[#B8A97A]">
                Guests Capacity
              </label>
              <select
                id="filter-guests-select"
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full bg-[#fdfbf7] px-3 py-[10px] border-[0.5px] border-[#B8A97A]/25 text-[10px] tracking-[0.15em] uppercase font-light focus:outline-none focus:border-[#B8A97A] rounded-none appearance-none cursor-pointer text-neutral-800"
              >
                <option value="All">{t.allCapacities}</option>
                <option value="8">{lang === "ES" ? "Hasta 8" : lang === "NL" ? "Max 8" : "Up to 8"}</option>
                <option value="10">{lang === "ES" ? "Hasta 10" : lang === "NL" ? "Max 10" : "Up to 10"}</option>
                <option value="12">12 {lang === "ES" ? "invitados" : lang === "NL" ? "gasten" : "guests"}</option>
              </select>
            </div>

          </div>

          {/* Sorter and range dynamic slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-[#B8A97A]/15 pt-5">
            {/* Custom pricing dynamic budget threshold slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-light">
                <span className="text-neutral-500">
                  Dynamic Price Filter ({selectedMonth.toUpperCase()})
                </span>
                <span className="text-[#0A0A0A] font-light text-sm font-sans tracking-wide">
                  €{maxPriceLimit.toLocaleString()} EUR
                </span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min="1000"
                max="6500"
                step="100"
                value={maxPriceLimit}
                onChange={(e) => setMaxPriceLimit(parseInt(e.target.value))}
                className="w-full h-1 cursor-ew-resize rounded-none appearance-none bg-neutral-200 accent-[#B8A97A]"
              />
              <div className="flex justify-between text-[9px] text-[#B8A97A] font-mono leading-none pt-1">
                <span>€1,000</span>
                <span>€3,500</span>
                <span>€6,500+</span>
              </div>
            </div>

            {/* Ordering Sorter dropdown matches Ref */}
            <div className="space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
              <label className="text-[10px] tracking-[0.2em] uppercase font-light text-[#B8A97A] flex items-center gap-1">
                <ArrowUpDown size={12} className="text-[#B8A97A]" />
                <span>{t.sortBy}</span>
              </label>

              <div className="w-full sm:w-72">
                <select
                  id="filter-sort-select"
                  value={sortByRule}
                  onChange={(e) => setSortByRule(e.target.value)}
                  className="w-full bg-[#0A0A0A] text-[#fdfbf7] px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase font-light focus:outline-none focus:bg-[#1a2744] rounded-none appearance-none cursor-pointer border-[0.5px] border-[#B8A97A]/30"
                >
                  <option value="price-asc">{t.sortPriceAsc}</option>
                  <option value="price-desc">{t.sortPriceDesc}</option>
                  <option value="size-desc">{t.sortSizeDesc}</option>
                  <option value="size-asc">{t.sortSizeAsc}</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
