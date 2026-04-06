import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "The Journey", to: "/journey" },
  { label: "Yearbook", to: "/yearbook" },
  { label: "Media Vault", to: "/vault" },
  { label: "The Wall", to: "/wall" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="flex items-center justify-center sticky top-0 z-50 px-4 sm:px-6 md:px-14 py-4 sm:py-5"
        style={{
          borderBottom: "0.5px solid rgba(201,168,76,0.2)",
          background: "rgba(17,17,16,0.96)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Logo — left */}
        <Link
          to="/"
          className="absolute left-4 sm:left-6 md:left-14 flex items-center gap-2 sm:gap-2.5 no-underline group"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ border: "1.5px solid #c9a84c" }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="#c9a84c">
              <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.6 3.5L7 9.5 3.9 11l.6-3.5L2 5l3.5-.5z" />
            </svg>
          </div>
          <span
            className="font-heading text-[15px] sm:text-[17px] text-off-white"
            style={{ letterSpacing: "0.03em" }}
          >
            Batch '26
          </span>
        </Link>

        {/* Desktop Nav Links — centered, hidden on mobile */}
        <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
          {links.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="no-underline transition-colors duration-200"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "14px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: active ? "#c9a84c" : "rgba(240,235,224,0.45)",
                    borderBottom: active ? "1.5px solid #c9a84c" : "none",
                    paddingBottom: active ? "2px" : "0",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger — right, only on mobile */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="absolute right-4 sm:right-6 flex md:hidden flex-col items-center justify-center w-9 h-9 gap-[5px] rounded-lg transition-all duration-200"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {/* 3 bars → X animation */}
          <span
            className="block w-4 h-[1.5px] rounded-full transition-all duration-300 origin-center"
            style={{
              background: "#c9a84c",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-4 h-[1.5px] rounded-full transition-all duration-300"
            style={{
              background: "#c9a84c",
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "none",
            }}
          />
          <span
            className="block w-4 h-[1.5px] rounded-full transition-all duration-300 origin-center"
            style={{
              background: "#c9a84c",
              transform: menuOpen
                ? "translateY(-6.5px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-down drawer */}
      <div
        className="fixed left-0 right-0 top-[57px] z-40 md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? "320px" : "0px",
          opacity: menuOpen ? 1 : 0,
          background: "rgba(17,17,16,0.98)",
          borderBottom: "0.5px solid rgba(201,168,76,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <ul className="flex flex-col list-none m-0 p-0 py-3">
          {links.map(({ label, to }, idx) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-3.5 no-underline transition-all duration-200"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "16px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: active ? "#c9a84c" : "rgba(240,235,224,0.6)",
                    background: active
                      ? "rgba(201,168,76,0.06)"
                      : "transparent",
                    borderLeft: active
                      ? "2px solid #c9a84c"
                      : "2px solid transparent",
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  <span>{label}</span>
                  {active && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c9a84c"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
