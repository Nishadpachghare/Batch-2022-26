import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "1460", label: "Days Together" },
  { value: "150+", label: "Memories Archived" },
  { value: "4", label: "Years of Growth" },
  { value: "∞", label: "Bonds Forged" },
];

function useCountUp(target, duration = 1800, start = false) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target.replace(/\D/g, ""));
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }
    const suffix = target.replace(/[\d]/g, "");
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * num) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return display;
}

function StatItem({ value, label, animate }) {
  const displayed = useCountUp(value, 1800, animate);
  return (
    <div className="text-center">
      <div
        className="text-gold font-heading font-bold tracking-tight mb-2"
        style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
      >
        {displayed}
      </div>
      <div
        className="text-xs font-body uppercase text-gray-400"
        style={{ letterSpacing: "0.2em" }}
      >
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-matte-black text-off-white overflow-x-hidden font-body">
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-74px)] flex flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-12 overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(42,36,16,0.7) 0%, transparent 70%)",
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Eyebrow */}
        <p
          className={`font-heading italic text-gold text-base sm:text-lg md:text-xl mb-4 sm:mb-6 transition-all duration-1000 ease-out text-center ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          A Journey We'll Always Carry
        </p>

        {/* Main Title */}
        <h1
          className={`font-heading font-bold text-center transition-all duration-1000 delay-100 text-shadow-gold ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            fontSize: "clamp(48px, 11vw, 160px)",
            lineHeight: 1.0,
            color: "#f0ebe0",
            letterSpacing: "-0.02em",
          }}
        >
          Batch{" "}
          <em
            className="font-light"
            style={{ color: "rgba(240,235,224,0.35)", fontStyle: "italic" }}
          >
            2022
          </em>
          <span className="text-off-white">—26</span>
        </h1>

        {/* Divider */}
        <div
          className={`flex items-center gap-4 my-6 sm:my-8 w-32 sm:w-40 transition-all duration-1000 delay-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="flex-1 h-px"
            style={{
              background: "linear-gradient(to right, transparent, #c9a84c)",
            }}
          />
          <div className="w-1 h-1 rounded-full bg-gold" />
          <div
            className="flex-1 h-px"
            style={{
              background: "linear-gradient(to left, transparent, #c9a84c)",
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className={`text-gray-400 text-center max-w-xs sm:max-w-md lg:max-w-xl font-body leading-relaxed transition-all duration-1000 delay-300 px-2 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
        >
          Four years of laughter, late nights, and lessons learned. Join us as
          we look back on the moments that defined us.
        </p>

        {/* CTA */}
        <div
          className={`mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center gap-6 sm:gap-8 transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link to="/journey" className="group relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10" />

            {/* Main button */}
            <div className="relative px-8 sm:px-12 py-3.5 sm:py-5 rounded-full border-2 border-gold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-light to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-20 group-hover:opacity-40" />

              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <span className="font-heading font-bold text-sm sm:text-base lg:text-lg uppercase tracking-widest text-gold group-hover:text-white transition-colors duration-300">
                  Start the Journey
                </span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gold group-hover:text-white transition-all duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              <div className="absolute top-1 left-1/4 w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-pulse" />
              <div className="absolute bottom-1 right-1/4 w-1 h-1 bg-gold-light rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-pulse" />
            </div>
          </Link>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 mt-2 sm:mt-4">
            <p className="text-xs tracking-widest text-gray-500 font-body uppercase">
              Scroll to explore
            </p>
            <div className="flex gap-1">
              <div
                className="w-1 h-6 sm:h-8 bg-gold/30 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-1 h-6 sm:h-8 bg-gold/50 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1 h-6 sm:h-8 bg-gold/30 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      {/*
        Responsive:
        - Mobile  → 2×2 grid, tighter gap
        - Desktop → 4 columns in a row
      */}
      <section
        ref={statsRef}
        className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-6 flex justify-center border-y"
        style={{ background: "#151513", borderColor: "#1e1e1c" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-12 max-w-5xl w-full">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="p-3 sm:p-4 transition duration-500 hover:-translate-y-1"
            >
              <StatItem
                value={s.value}
                label={s.label}
                animate={statsVisible}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative border-t border-gold/10 bg-gradient-to-b from-matte-black to-black/50">
        <div className="px-4 sm:px-6 py-10 sm:py-12 text-center">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-gold mb-4">
            Batch '26
          </h2>

          <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/60 text-xs">✦</span>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          <p className="text-gray-400 font-body text-sm max-w-xs sm:max-w-md lg:max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
            "Four years of memories, a lifetime of bonds. This yearbook is our
            story—preserved forever."
          </p>

          <div className="text-xs text-gray-600 space-y-1.5 sm:space-y-2">
            <p>© 2026 Batch 2022-26 • All memories preserved</p>
            <p>
              Built with <span className="text-gold">♥</span> for memories that
              last forever
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
