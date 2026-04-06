import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getApiErrorMessage, getMedia } from "../lib/yearbookApi";

const CATEGORIES = ["All Memories", "1st yr", "2nd yr", "3rd yr", "4th yr"];

export default function MediaVault() {
  const [media, setMedia] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All Memories");
  const [sortOrder, setSortOrder] = useState("newest");
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadVault() {
      setLoading(true);
      setLoadError("");
      try {
        const items = await getMedia();
        if (!ignore) setMedia(items);
      } catch (error) {
        if (!ignore)
          setLoadError(
            getApiErrorMessage(error, "Could not load the Media Vault."),
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadVault();
    return () => {
      ignore = true;
    };
  }, []);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const filtered = media.filter(
    (item) => selectedYear === "All Memories" || item.year === selectedYear,
  );

  const sorted = [...filtered].sort((l, r) => {
    const lt = new Date(l.uploadedAt || 0).getTime();
    const rt = new Date(r.uploadedAt || 0).getTime();
    return sortOrder === "newest" ? rt - lt : lt - rt;
  });

  return (
    <div
      className="min-h-screen text-off-white"
      style={{ background: "#111110" }}
    >
      <Navbar />

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-7 sm:mb-10">
          {/* Title + subtitle */}
          <div>
            <h1
              className="font-heading italic font-bold text-off-white leading-none mb-2 sm:mb-3"
              style={{ fontSize: "clamp(38px, 7vw, 88px)" }}
            >
              The Archive
            </h1>
            <p className="text-gray-400 font-body max-w-sm sm:max-w-md text-sm sm:text-base leading-relaxed">
              A cinematic collection of fleeting moments, frozen in time. From
              the first lecture to the final goodbye.
            </p>
          </div>

          {/* Sort button */}
          <button
            onClick={() =>
              setSortOrder((p) => (p === "newest" ? "oldest" : "newest"))
            }
            className="flex items-center gap-2 font-body text-sm transition-all duration-200 self-start sm:self-end cursor-pointer whitespace-nowrap"
            style={{
              color: "rgba(240,235,224,0.6)",
              border: "1px solid #2e2e2b",
              borderRadius: "999px",
              padding: "8px 16px",
              background: "#1a1a18",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#c9a84c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#2e2e2b")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M7 12h10M11 18h2" />
            </svg>
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </button>
        </div>

        {loadError && (
          <div
            className="mb-6 sm:mb-8 rounded-2xl px-4 py-3 font-body text-sm"
            style={{
              border: "1px solid rgba(186, 93, 82, 0.45)",
              background: "rgba(79, 26, 22, 0.4)",
              color: "#f7c5c0",
            }}
          >
            {loadError}
          </div>
        )}

        {/* ── FILTER PILLS ──
            Mobile: horizontally scrollable, no wrapping
            Desktop: wraps naturally
        */}
        <div className="flex gap-2 sm:gap-2.5 mb-7 sm:mb-10 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedYear(cat)}
              className="font-body text-xs sm:text-sm transition-all duration-200 cursor-pointer flex-shrink-0"
              style={{
                padding: "7px 16px",
                borderRadius: "999px",
                border:
                  selectedYear === cat
                    ? "1px solid #c9a84c"
                    : "1px solid #2e2e2b",
                background: selectedYear === cat ? "#c9a84c" : "transparent",
                color:
                  selectedYear === cat ? "#111110" : "rgba(240,235,224,0.5)",
                fontWeight: selectedYear === cat ? 700 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GALLERY ──
          Mobile  → 1 column
          Tablet  → 2 columns
          Desktop → 3 columns
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        {loading ? (
          <div className="text-center py-16 sm:py-24">
            <p className="font-heading text-xl sm:text-2xl text-gold">
              Loading archive...
            </p>
            <p className="font-body text-gray-500 mt-2 text-sm sm:text-base">
              Pulling the latest memories from the backend.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
              {sorted.map((item) => (
                <div
                  key={item._id}
                  className="break-inside-avoid overflow-hidden group relative cursor-pointer"
                  style={{ borderRadius: "8px" }}
                  onClick={() => setLightbox(item)}
                >
                  {item.resourceType === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      alt={item.caption || `Memory ${item.year}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://picsum.photos/seed/memory/400/300";
                      }}
                    />
                  )}

                  {/* Year badge */}
                  <div
                    className="absolute top-2 sm:top-3 left-2 sm:left-3 font-body text-[10px] sm:text-xs uppercase font-bold"
                    style={{
                      background: "#c9a84c",
                      color: "#111110",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.year}
                  </div>

                  {/* Caption overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 px-3 sm:px-4 py-2 sm:py-3 text-left"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",
                    }}
                  >
                    <p className="font-body text-xs sm:text-sm text-off-white truncate">
                      {item.caption}
                    </p>
                    <p className="font-body text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.18em] mt-0.5 sm:mt-1">
                      {item.uploadedBy || "Anonymous"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-16 sm:py-24">
                <p className="font-heading text-xl sm:text-2xl text-gray-600">
                  No memories here yet
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── LIGHTBOX ──
          Mobile: full-screen feel, close button bigger, caption at bottom
          Desktop: same as before with padding
      */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background: "rgba(0,0,0,0.94)" }}
          onClick={() => setLightbox(null)}
        >
          {/* Close button — bigger tap target on mobile */}
          <button
            className="absolute top-3 right-3 sm:top-5 sm:right-6 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto rounded-full transition-colors hover:text-gold cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f0ebe0",
            }}
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          {/* Media */}
          {lightbox.resourceType === "video" ? (
            <video
              src={lightbox.url}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightbox.url}
              alt={lightbox.caption || "Memory"}
              className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Caption */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center px-4 sm:px-6">
            <p className="font-body text-xs sm:text-sm text-off-white">
              {lightbox.caption}
            </p>
            <span className="font-body text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mt-1 block">
              {lightbox.year}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
