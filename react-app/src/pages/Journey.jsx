import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const milestones = [
  {
    year: "2022",
    era: "Year One",
    caption: "The First Group Picture🍂",
    title: "The First Group Picture",
    description: `We didn't know why this photo was being taken.
Just told, "Go to the ground."
Funny thing? We didn't even know which one.
Confusion, random guesses… and somehow, this picture happened.`,
    date: "— November, 2022",
  },
  {
    year: "2023",
    era: "Year Two",
    caption: "The First Traditional Day🎉",
    title: "First Traditional day",
    description: `A day before, everyone was asking “What are you wearing tomorrow?”
Outfits mattered then, memories matter now.`,
    date: "— February, 2023",
  },
  {
    year: "2024",
    era: "Year Three",
    caption: "The One-Day Trip",
    title: "A Crazy Trip",
    description: `A small trip, but endless memories.
Laughing, exploring, and just being together.
The best part?
That one night spent with friends —
simple, but unforgettable.`,
    date: "— January, 2024",
  },
  {
    year: "2025",
    era: "Year Four",
    caption: "College fest 🎈",
    title: "Antaragini Days",
    description: `Every year, the same calls —Kaun kaun aa raha hai?
Plans depended on the crowd
because fest was only fun
when everyone showed up.`,
    date: "— February, 2025",
  },
  {
    year: "2026",
    era: "The Final Chapter",
    caption: "The Last Trip 🎓",
    title: "We Made It",
    description: `Because it was our last,
we made sure it was unforgettable.
Around 28 of us,
a day full of fun, water, laughter, and love.
Photos, videos, and moments —
memories that will stay forever.`,
    date: "— March, 2026",
  },
];

export default function Journey() {
  const milestoneRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    milestoneRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = "opacity 0.75s ease, transform 0.75s ease";
        observer.observe(el);
      }
    });

    if (milestoneRefs.current[0]) {
      milestoneRefs.current[0].style.opacity = "1";
      milestoneRefs.current[0].style.transform = "translateY(0)";
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen pb-24 relative overflow-hidden"
      style={{ background: "#141210", color: "#f0ebe0" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,140,60,0.07) 0%, transparent 55%)",
        }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <div className="text-center pt-16 pb-8 px-5">
        <p
          className="mb-5 font-body uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.35em",
            color: "#c9a84c",
          }}
        >
          Our History
        </p>
        <h1
          className="font-heading font-bold"
          style={{
            fontSize: "clamp(34px, 5vw, 54px)",
            color: "#f0ebe0",
            lineHeight: 1.1,
          }}
        >
          The Journey:{" "}
          <em style={{ fontStyle: "italic", color: "rgba(240,235,224,0.5)" }}>
            2022–2026
          </em>
        </h1>

        {/* Ornament divider */}
        <div className="flex items-center justify-center gap-4 mx-auto mt-10 mb-4 w-48">
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
      </div>

      {/* ── TIMELINE ── */}
      <div className="max-w-[1020px] mx-auto px-5 md:px-10 relative mt-10">
        {/* Center spine */}
        <div
          className="absolute top-0 bottom-0 w-px hidden md:block"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, transparent, rgba(180,140,60,0.3) 8%, rgba(180,140,60,0.3) 92%, transparent)",
          }}
        />

        {milestones.map((m, i) => {
          const isLeft = i % 2 === 0;

          return (
            <div
              key={m.year}
              ref={(el) => (milestoneRefs.current[i] = el)}
              className="relative mb-20 md:mb-[90px]"
            >
              {/* ── DESKTOP layout ── */}
              <div
                className="hidden md:grid items-center"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
              >
                {/* Left cell */}
                <div
                  className={`flex items-center ${
                    isLeft ? "justify-end pr-12" : "justify-start pl-12"
                  }`}
                  style={{ order: isLeft ? 1 : 3 }}
                >
                  {isLeft ? (
                    <Polaroid
                      m={m}
                      rotate="-2deg"
                      onImageClick={() => setSelectedImage(m.year)}
                    />
                  ) : (
                    <TextBlock m={m} align="right" />
                  )}
                </div>

                {/* Center badge */}
                <div
                  className="flex items-center justify-center z-10"
                  style={{ order: 2 }}
                >
                  <YearBadge year={m.year} />
                </div>

                {/* Right cell */}
                <div
                  className={`flex items-center ${
                    isLeft ? "pl-12" : "justify-end pr-12"
                  }`}
                  style={{ order: isLeft ? 3 : 1 }}
                >
                  {isLeft ? (
                    <TextBlock m={m} align="left" />
                  ) : (
                    <Polaroid
                      m={m}
                      rotate="2deg"
                      onImageClick={() => setSelectedImage(m.year)}
                    />
                  )}
                </div>
              </div>

              {/* ── MOBILE layout ── */}
              <div className="flex flex-col items-center gap-5 md:hidden">
                <YearBadge year={m.year} />
                <Polaroid
                  m={m}
                  rotate={isLeft ? "-1.5deg" : "1.5deg"}
                  onImageClick={() => setSelectedImage(m.year)}
                />
                <TextBlock m={m} align="center" />
              </div>
            </div>
          );
        })}
      </div>

      {/* End ornament */}
      <div
        className="text-center mt-4"
        style={{
          color: "rgba(201,168,76,0.35)",
          fontSize: "20px",
          letterSpacing: "14px",
        }}
      >
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/images/journey-${selectedImage}.jpg`}
              alt="Journey photo"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function YearBadge({ year }) {
  return (
    <div
      className="w-[62px] h-[62px] rounded-full flex items-center justify-center flex-shrink-0"
      style={{ border: "1px solid #c9a84c", background: "#141210" }}
    >
      <span
        className="font-heading font-semibold"
        style={{ fontSize: "13px", color: "#c9a84c", letterSpacing: "0.04em" }}
      >
        {year}
      </span>
    </div>
  );
}

function Polaroid({ m, rotate, onImageClick }) {
  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        background: "#f5f0e8",
        padding: "16px 16px 65px",
        boxShadow: "0 10px 44px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)",
        width: "380px",
        transform: `rotate(${rotate})`,
      }}
      onClick={onImageClick}
    >
      <div
        className="overflow-hidden"
        style={{ width: "348px", height: "262px", background: "#2a2520" }}
      >
        <img
          src={`/images/journey-${m.year}.jpg`}
          alt={m.caption}
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(0%)" }}
          onError={(e) => {
            // Fallback: show a dark placeholder with the year
            e.target.style.display = "none";
            e.target.parentElement.style.display = "flex";
            e.target.parentElement.style.alignItems = "center";
            e.target.parentElement.style.justifyContent = "center";
          }}
        />
      </div>
      <p
        className="absolute bottom-2.5 left-0 right-0 text-center font-handwriting"
        style={{ fontSize: "13px", color: "#4a3f2a" }}
      >
        {m.caption}
      </p>
    </div>
  );
}

function TextBlock({ m, align }) {
  const textAlign =
    align === "center" ? "center" : align === "right" ? "right" : "left";
  return (
    <div style={{ maxWidth: "290px", textAlign }}>
      <p
        className="font-body uppercase mb-1.5"
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "rgba(201,168,76,0.6)",
        }}
      >
        {m.era}
      </p>
      <h2
        className="font-heading font-semibold mb-3.5"
        style={{ fontSize: "26px", color: "#f0ebe0", lineHeight: 1.2 }}
      >
        {m.title}
      </h2>
      <p
        className="font-body"
        style={{
          fontSize: "16px",
          fontWeight: 300,
          color: "rgba(240,235,224,0.58)",
          lineHeight: 1.8,
        }}
      >
        {m.description}
      </p>
      <p
        className="mt-3.5 font-body italic"
        style={{
          fontSize: "13px",
          color: "rgba(201,168,76,0.5)",
          letterSpacing: "0.04em",
        }}
      >
        {m.date}
      </p>
    </div>
  );
}
