import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Send } from "lucide-react";
import { Locale, Yacht } from "../types";
import { translations } from "../data/translations";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
  prefilledYacht?: Yacht | null;
  fleet: Yacht[];
}

export default function ContactModal({
  isOpen,
  onClose,
  lang,
  prefilledYacht,
  fleet
}: ContactModalProps) {
  const t = translations[lang];

  // Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("6");
  const [budget, setBudget] = useState("2500");
  const [selectedYachtId, setSelectedYachtId] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync prefilled yacht
  useEffect(() => {
    if (prefilledYacht) {
      setSelectedYachtId(prefilledYacht.id);
    } else {
      setSelectedYachtId("");
    }
  }, [prefilledYacht, isOpen]);

  const selectedYachtName =
    fleet.find((y) => y.id === selectedYachtId)?.name ||
    (prefilledYacht ? prefilledYacht.name : "");

  // Generate computed copyable text
  const yachtReferenceText = selectedYachtName
    ? `${selectedYachtName} (send a screenshot of your fav boat)`
    : "(send a screenshot of your fav boat)";

  const computedMessage = `Hi, my name is ${name || "__________"}. I am interested in booking a boat for this date ${date || "__________"}, we are ${guests || "__________"} people, and our budget is ${budget || "__________"} EUR. I have a preference: ${yachtReferenceText}. Thanks!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(computedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleWhatsAppRedirect = () => {
    const waUrl = `https://wa.me/34600000000?text=${encodeURIComponent(computedMessage)}`;
    window.open(waUrl, "_blank", "referrer");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0A0A0A]/65 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <motion.div
          id="modal-panel"
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden bg-[#fdfbf7] text-[#0A0A0A] shadow-[0_30px_70px_rgba(184,169,122,0.18)] border-[0.5px] border-[#B8A97A]/25 z-10 rounded-none flex flex-col max-h-[90vh]"
        >
          {/* Accent Line */}
          <div className="h-[2px] bg-[#B8A97A] w-full" />

          {/* Close trigger */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#B8A97A] hover:text-[#0A0A0A] transition-colors p-1 cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto">
            <span className="text-[8px] sm:text-[9px] tracking-[0.45em] uppercase font-light text-[#B8A97A] block mb-2">
              {t.curiousBtn}
            </span>
            <h3 className="font-display font-light text-2xl tracking-[0.22em] text-[#0A0A0A] uppercase mb-1.5 leading-none">
              {t.modalTitle}
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-6 font-light">
              {t.modalDesc}
            </p>

            {/* Interactive Blueprint Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[8.5px] uppercase tracking-[0.25em] text-[#B8A97A] font-light mb-1.5">
                  {t.nameLabel}*
                </label>
                <input
                  id="form-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jean-Pierre Moreau"
                  className="w-full bg-white px-3 py-2.5 border-[0.5px] border-[#B8A97A]/25 text-xs focus:outline-none focus:border-[#B8A97A] rounded-none transition-colors tracking-wide"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8.5px] uppercase tracking-[0.25em] text-[#B8A97A] font-light mb-1.5">
                    {t.dateLabel}*
                  </label>
                  <input
                    id="form-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white px-3 py-2 border-[0.5px] border-[#B8A97A]/25 text-xs focus:outline-none focus:border-[#B8A97A] rounded-none transition-colors tracking-wide"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] uppercase tracking-[0.25em] text-[#B8A97A] font-light mb-1.5">
                    {t.guestsLabel}*
                  </label>
                  <input
                    id="form-guests"
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-white px-3 py-2 border-[0.5px] border-[#B8A97A]/25 text-xs focus:outline-none focus:border-[#B8A97A] rounded-none transition-colors tracking-wide"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8.5px] uppercase tracking-[0.25em] text-[#B8A97A] font-light mb-1.5">
                    {t.budgetLabel} (€)*
                  </label>
                  <input
                    id="form-budget"
                    type="number"
                    step="250"
                    min="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-white px-3 py-2 border-[0.5px] border-[#B8A97A]/25 text-xs focus:outline-none focus:border-[#B8A97A] rounded-none transition-colors tracking-wide"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] uppercase tracking-[0.25em] text-[#B8A97A] font-light mb-1.5">
                    {t.boatPref}
                  </label>
                  <select
                    id="form-yacht-select"
                    value={selectedYachtId}
                    onChange={(e) => setSelectedYachtId(e.target.value)}
                    className="w-full bg-white px-3 py-[9px] border-[0.5px] border-[#B8A97A]/25 text-xs focus:outline-none focus:border-[#B8A97A] rounded-none transition-colors tracking-wide cursor-pointer uppercase text-[10px]"
                  >
                    <option value="">-- Let concierge recommend --</option>
                    {fleet.map((yacht) => (
                      <option key={yacht.id} value={yacht.id}>
                        {yacht.brand} {yacht.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Generated blueprint preview box on Alternate Cream */}
            <div className="bg-[#F4F4F2] border-[0.5px] border-[#B8A97A]/20 p-4 mb-6 font-mono text-[10.5px] leading-relaxed text-[#0A0A0A] relative select-all rounded-none">
              <div className="absolute top-1 right-2 text-[7px] uppercase tracking-[0.25em] text-[#B8A97A] font-sans font-medium">
                live template preview
              </div>
              <p className="mt-2 text-neutral-800 break-words font-medium">
                {computedMessage}
              </p>
            </div>

            {/* Actions with no-border-radius 0.45em tracking */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="copy-to-clipboard-btn"
                type="button"
                onClick={handleCopy}
                className={`flex-1 py-3.5 text-[8.5px] tracking-[0.45em] uppercase font-light text-center border-[0.5px] transition-all duration-300 flex items-center justify-center gap-1.5 rounded-none cursor-pointer ${
                  copied
                    ? "bg-[#B8A97A]/10 border-[#B8A97A] text-[#B8A97A]"
                    : "bg-white border-[#B8A97A]/30 hover:border-[#0A0A0A] text-[#0A0A0A]"
                }`}
              >
                {copied ? <Check size={12} className="animate-bounce" /> : <Copy size={11} />}
                {copied ? t.copiedBtn : t.copyBtn}
              </button>

              <button
                id="send-to-whatsapp-btn"
                type="button"
                onClick={handleWhatsAppRedirect}
                className="flex-1 bg-[#0A0A0A] text-[#fdfbf7] hover:bg-[#1a2744] hover:text-white py-3.5 text-[8.5px] tracking-[0.45em] uppercase font-light text-center transition-all flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
              >
                <Send size={11} className="text-[#B8A97A]" />
                {t.openWatsAppBtn}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
