import React from "react";
import { motion } from "motion/react";
import { Locale } from "../types";
import { translations } from "../data/translations";

interface HeroProps {
  lang: Locale;
  onExploreClick: () => void;
}

export default function Hero({ lang, onExploreClick }: HeroProps) {
  const t = translations[lang];
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Calculate quantity based on viewport dimension (simulating window.innerWidth * window.innerHeight / 14000)
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // fine drifting speed
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 0.5,    // sun sparkles on water
          opacity: Math.random() * 0.4 + 0.3,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrapping boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Aqua turquise sparkles simulating reflection light
        ctx.fillStyle = `rgba(144, 224, 239, ${p.opacity})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative min-h-[60vh] sm:min-h-[65vh] bg-[#fdfbf7] overflow-hidden flex items-center justify-center text-[#0A0A0A] py-16 sm:py-24 border-b border-[#B8A97A]/15">
      {/* Background container #scroll-video-container style equivalent with Riva Yacht and turquise base */}
      <div className="absolute inset-0 z-0 bg-[#e6f4f4]">
        <img
          src="https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=2200&q=88"
          alt="Riva Argo Luxury Experience Ibiza"
          className="w-full h-full object-cover object-center opacity-70 select-none pb-12"
        />
        {/* Superior cover layering to soften and illuminate with soft warm cream and turquise tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/60 via-transparent to-[#fdfbf7]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7]/90 via-[#fdfbf7]/40 to-transparent" />
        
        {/* Water sparkles interactive overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-90"
        />
      </div>

      {/* Grid luxury micro-elements for extra frame depth */}
      <div className="absolute inset-0 pointer-events-none z-10 border-[16px] border-[#fdfbf7]" />
      <div className="absolute inset-4 pointer-events-none z-10 border border-[#B8A97A]/20" />

      {/* Minimalist Centered Text */}
      <div className="relative z-20 text-center px-6 max-w-4xl flex flex-col items-center">
        
        {/* Brand Eyebrow Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-1 mb-4"
        >
          <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.45em] font-light text-[#B8A97A] uppercase">
            TOP BOATS • IBIZA • AVAILABLE NOW
          </span>
        </motion.div>

        {/* Exclusive Display Header: INFINITY BOATS in Navy #1a2744 */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display font-light text-3xl sm:text-5xl md:text-6xl tracking-[0.26em] text-[#1a2744] uppercase leading-[1.15] mb-5"
        >
          INFINITY BOATS
        </motion.h1>

        {/* Custom 0.5pt rules decoration centered around the brand name - Page 5 rule */}
        <div className="w-16 h-[0.5px] bg-[#B8A97A] mb-5 opacity-70" />

        {/* Brand core emotional pitch Display Italic (Page 4 specifications) */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-display italic font-light text-lg sm:text-2xl md:text-3xl tracking-[0.05em] text-[#B8A97A] mb-8"
        >
          Where the Mediterranean begins.
        </motion.h2>

        {/* Explanatory subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] text-[#0A0A0A]/70 uppercase max-w-xl text-center leading-relaxed mb-8"
        >
          {t.heroSub}
        </motion.p>

        {/* Elegant Primary Button (Page 9 specification: solid black, white text, 0px border-radius, tracking 0.45em) */}
        <motion.button
          id="hero-explore-cta"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onClick={onExploreClick}
          className="group relative bg-[#0A0A0A] hover:bg-[#1a2744] text-[#fdfbf7] font-sans font-light text-[9px] sm:text-[10px] tracking-[0.45em] px-8 py-3.5 uppercase transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-black/20"
        >
          <span>{t.discoverCTA}</span>
        </motion.button>
      </div>
    </section>
  );
}
