export interface Yacht {
  id: string;
  name: string;
  brand: string;
  type: string; // e.g. "Yacht" | "Superyacht" | "Catamaran" | "Cruiser"
  sizeMeters: number;
  sizeFeet: number;
  maxGuests: number;
  images: string[];
  charterCode: string; // Secret indicator
  included: { [locale: string]: string[] };
  excluded: { [locale: string]: string[] };
  pricing: {
    highSeason: number; // July, August
    midSeason: number;  // June, September
    lowSeason: number;  // May, October, and others
  };
}

export type Locale = "EN" | "NL" | "ES" | "FR" | "IT";

export interface Translations {
  heroTagline: string;
  heroSub: string;
  discoverCTA: string;
  filterTitle: string;
  searchPlaceholder: string;
  allTypes: string;
  allCapacities: string;
  allSizes: string;
  sortBy: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortSizeDesc: string;
  sortSizeAsc: string;
  maxPeople: string;
  meters: string;
  feet: string;
  monthSelect: string;
  pricePerDay: string;
  includedTitle: string;
  excludedTitle: string;
  charterCodeLabel: string;
  bookWhatsApp: string;
  curiousBtn: string;
  modalTitle: string;
  modalDesc: string;
  nameLabel: string;
  dateLabel: string;
  guestsLabel: string;
  budgetLabel: string;
  boatPref: string;
  copyBtn: string;
  copiedBtn: string;
  openWatsAppBtn: string;
  closeBtn: string;
  testimonialsTitle: string;
  testimonialList: Array<{ quote: string; author: string; role: string }>;
  showMore: string;
  showLess: string;
  highSeason: string;
  midSeason: string;
  lowSeason: string;
  vatIncluded: string;
  vatExcluded: string;
  noResults: string;
}
