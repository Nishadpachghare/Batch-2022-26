import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  getMessages,
  postMessage,
  getApiErrorMessage,
} from "../lib/yearbookApi";

const NOTE_VARIANTS = [
  { bg: "#fef3c7", rotate: "rotate-1" },
  { bg: "#fde68a", rotate: "-rotate-1" },
  { bg: "#fdf6e3", rotate: "rotate-[0.8deg]" },
  { bg: "#fef9c3", rotate: "-rotate-[0.6deg]" },
  { bg: "#fffbeb", rotate: "rotate-[1.2deg]" },
];

export default function Wall() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadMessages() {
      setLoading(true);
      setError("");
      try {
        const msgs = await getMessages();
        if (!ignore) setMessages(msgs);
      } catch (err) {
        if (!ignore)
          setError(getApiErrorMessage(err, "Could not load the message wall."));
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadMessages();
    return () => {
      ignore = true;
    };
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSubmitting(true);
    try {
      const postedMsg = await postMessage({
        content: newMsg.trim(),
        fromName: "Anonymous",
        toName: "The Wall",
      });
      setMessages((prev) => [postedMsg, ...prev]);
      setNewMsg("");
      setShowForm(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not post your message."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-off-white"
      style={{ background: "#0f1520" }}
    >
      <Navbar />

      {/* ── HERO ── */}
      <div className="text-center py-10 sm:py-14 lg:py-16 px-4">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-4 sm:mb-5 font-body text-xs uppercase font-bold rounded-full"
          style={{
            background: "#1e2535",
            border: "1px solid #c9a84c44",
            color: "#c9a84c",
            padding: "6px 14px",
            letterSpacing: "0.18em",
          }}
        >
          <span>♥</span> Final Goodbyes
        </div>

        {/* Title */}
        <h1
          className="font-heading font-bold text-off-white mb-3 sm:mb-5"
          style={{ fontSize: "clamp(28px, 6vw, 72px)", lineHeight: 1.1 }}
        >
          Message Wall of Reflection
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 font-body max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 px-2">
          A space to leave your final words, memories, and wishes. These notes
          will remain here as a testament to our journey.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setShowForm((p) => !p)}
          className="font-body font-bold uppercase transition-all duration-200 cursor-pointer text-xs sm:text-sm"
          style={{
            background: showForm ? "transparent" : "#c9a84c",
            color: showForm ? "#c9a84c" : "#111110",
            border: "1px solid #c9a84c",
            padding: "10px 22px",
            letterSpacing: "0.12em",
            borderRadius: "2px",
          }}
        >
          {showForm ? "Cancel" : "+ Leave a Note"}
        </button>

        {/* Inline Form */}
        {showForm && (
          <form
            onSubmit={handlePost}
            className="w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto mt-6 sm:mt-8 text-left px-2 sm:px-0"
          >
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              rows={4}
              required
              placeholder="Write your message to the class..."
              className="w-full font-handwriting text-base sm:text-xl text-black outline-none resize-none mb-3"
              style={{
                background: "#fef9e8",
                border: "1px solid #e0d5b0",
                padding: "12px 14px",
                lineHeight: 1.6,
                borderRadius: "2px",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="font-body font-bold uppercase transition-all duration-200 cursor-pointer w-full text-xs sm:text-sm"
              style={{
                background: submitting ? "#888" : "#c9a84c",
                color: "#111110",
                border: "none",
                padding: "11px 12px",
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
            >
              {submitting ? "Posting..." : "Post Anonymously"}
            </button>
          </form>
        )}
      </div>

      {/* ── NOTES MASONRY ──
          Mobile  → 1 column (full width, easy to read)
          Tablet  → 2 columns
          Desktop → 3 columns
          XL      → 4 columns
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        {error && (
          <div
            className="mb-6 sm:mb-8 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-body text-sm"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.05)",
              color: "#d4af37",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-10 sm:py-12">
            <p className="font-body text-gray-400 text-sm sm:text-base">
              Loading messages...
            </p>
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16">
            <p className="font-body text-gray-500 mb-2 text-sm sm:text-base">
              No messages yet.
            </p>
            <p className="font-body text-gray-600 text-xs sm:text-sm">
              Be the first to leave a note! 💭
            </p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {messages.map((msg, index) => {
              const variant = NOTE_VARIANTS[index % NOTE_VARIANTS.length];
              return (
                <div
                  key={msg._id}
                  className={`break-inside-avoid shadow-xl relative transition-transform duration-300 hover:-translate-y-1 ${variant.rotate}`}
                  style={{ background: variant.bg }}
                >
                  {/* Tape effect */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-1"
                    style={{
                      width: "48px",
                      height: "16px",
                      background: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(2px)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  />

                  {/* Message content */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <p
                      className="font-handwriting text-black leading-relaxed"
                      style={{
                        fontSize: "clamp(15px, 2vw, 20px)",
                        lineHeight: 1.55,
                      }}
                    >
                      "{msg.content}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
