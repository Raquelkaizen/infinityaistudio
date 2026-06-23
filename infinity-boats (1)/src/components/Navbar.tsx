import React from "react";
import { Globe, Compass } from "lucide-react";
import { Locale } from "../types";
import { translations } from "../data/translations";

interface NavbarProps {
  currentLang: Locale;
  setLang: (lang: Locale) => void;
  onOpenCurious: () => void;
}

export default function Navbar({ currentLang, setLang, onOpenCurious }: NavbarProps) {
  const t = translations[currentLang];
  const languages: { code: Locale; name: string }[] = [
    { code: "EN", name: "EN" },
    { code: "NL", name: "NL" },
    { code: "ES", name: "ES" },
    { code: "FR", name: "FR" },
    { code: "IT", name: "IT" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#B8A97A]/20 py-5 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <Compass className="text-[#B8A97A] stroke-[1.25] h-5 w-5 sm:h-6 sm:w-6 animate-spin-slow" />
          <div className="flex flex-col">
            <span className="font-display font-light tracking-[0.26em] text-[#0A0A0A] text-lg sm:text-2xl uppercase leading-none">
              INFINITY
            </span>
            <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.36em] text-[#B8A97A] font-light uppercase mt-1 leading-none">
              BOATS IBIZA
            </span>
          </div>
        </div>

        {/* Global actions: Language bar & Curious CTA */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Language selection switches */}
          <div className="flex gap-4 sm:gap-6 text-[10px] tracking-[0.2em] font-light text-neutral-400" id="lang-selector">
            {languages.map((langOption) => (
              <button
                key={langOption.code}
                id={`lang-btn-${langOption.code}`}
                onClick={() => setLang(langOption.code)}
                className={`transition-all uppercase cursor-pointer py-1 ${
                  currentLang === langOption.code
                    ? "text-[#0A0A0A] font-medium border-b border-[#B8A97A]"
                    : "hover:text-[#0A0A0A]"
                }`}
              >
                {langOption.name}
              </button>
            ))}
          </div>

          {/* Luxury Outline CTA Button */}
          <button
            id="curious-primary-btn"
            onClick={onOpenCurious}
            className="group relative px-5 py-2.5 border border-[#0A0A0A]/30 text-[9px] tracking-[0.45em] font-light uppercase hover:bg-[#0A0A0A] hover:text-[#fdfbf7] hover:border-[#0A0A0A] transition-all duration-300"
          >
            <span>{t.curiousBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
