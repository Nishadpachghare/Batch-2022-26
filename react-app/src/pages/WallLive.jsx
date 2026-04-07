import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getApiErrorMessage,
  getMessages,
  postMessage,
} from "../lib/yearbookApi";

const NOTE_VARIANTS = [
  { bg: "#fef3c7", rotate: "rotate-1" },
  { bg: "#fde68a", rotate: "-rotate-1" },
  { bg: "#fdf6e3", rotate: "rotate-[0.8deg]" },
  { bg: "#fef9c3", rotate: "-rotate-[0.6deg]" },
  { bg: "#fffbeb", rotate: "rotate-[1.2deg]" },
];

export default function WallLive() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadWall() {
      setLoading(true);
      setLoadError("");

      try {
        const wallMessages = await getMessages();

        if (!ignore) {
          setMessages(wallMessages);
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(
            getApiErrorMessage(error, "Could not load messages from the wall."),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadWall();
    return () => {
      ignore = true;
    };
  }, []);

  const handlePost = async (event) => {
    event.preventDefault();

    if (!newMsg.trim()) {
      setSubmitError("Write something before posting.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const createdMessage = await postMessage({
        content: newMsg.trim(),
        toName: "The Wall",
      });

      setMessages((currentMessages) => [createdMessage, ...currentMessages]);
      setNewMsg("");
      setShowForm(false);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Could not post your message yet."),
      );
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

      <div className="text-center py-16 px-4">
        <div
          className="inline-flex items-center gap-2 mb-5 font-body text-xs uppercase font-bold rounded-full"
          style={{
            background: "#1e2535",
            border: "1px solid #c9a84c44",
            color: "#c9a84c",
            padding: "6px 16px",
            letterSpacing: "0.18em",
          }}
        >
          <span>Wall Notes</span>
        </div>

        <h1
          className="font-heading font-bold text-off-white mb-5"
          style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.1 }}
        >
          Message Wall of Reflection
        </h1>
        <p className="text-gray-400 font-body max-w-2xl mx-auto text-base leading-relaxed mb-8">
          A space to leave your final words, memories, and wishes. These notes
          remain here as a testament to our journey.
        </p>

        <button
          onClick={() => {
            setShowForm((current) => !current);
            setSubmitError("");
          }}
          className="font-body font-bold uppercase transition-all duration-200 cursor-pointer"
          style={{
            background: showForm ? "transparent" : "#c9a84c",
            color: showForm ? "#c9a84c" : "#111110",
            border: "1px solid #c9a84c",
            padding: "11px 28px",
            fontSize: "13px",
            letterSpacing: "0.12em",
            borderRadius: "2px",
          }}
        >
          {showForm ? "Cancel" : "+ Leave a Note"}
        </button>

        {showForm && (
          <form
            onSubmit={handlePost}
            className="max-w-lg mx-auto mt-8 text-left"
          >
            <textarea
              value={newMsg}
              onChange={(event) => {
                setNewMsg(event.target.value);
                setSubmitError("");
              }}
              rows={4}
              maxLength={280}
              required
              placeholder="Write your message to the class..."
              className="w-full font-handwriting text-xl text-black outline-none resize-none mb-3"
              style={{
                background: "#fef9e8",
                border: "1px solid #e0d5b0",
                padding: "14px 16px",
                lineHeight: 1.6,
                borderRadius: "2px",
              }}
            />

            {submitError && (
              <p className="mb-3 font-body text-sm text-[#f7c5c0]">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="font-body font-bold uppercase transition-all duration-200 cursor-pointer w-full disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: submitting ? "#888" : "#c9a84c",
                color: "#111110",
                border: "none",
                padding: "12px",
                fontSize: "13px",
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
            >
              {submitting ? "Posting..." : "Post Anonymously"}
            </button>
          </form>
        )}
      </div>

      {loadError && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div
            className="rounded-2xl px-4 py-3 font-body text-sm"
            style={{
              border: "1px solid rgba(186, 93, 82, 0.45)",
              background: "rgba(79, 26, 22, 0.4)",
              color: "#f7c5c0",
            }}
          >
            {loadError}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center py-24">
            <p className="font-heading text-2xl text-gold">Loading notes...</p>
            <p className="font-body text-gray-500 mt-2">
              Pulling the latest wall messages from the backend.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
              {messages.map((message, index) => {
                const variant = NOTE_VARIANTS[index % NOTE_VARIANTS.length];
                return (
                  <div
                    key={message._id}
                    className={`break-inside-avoid p-6 shadow-xl relative transition-transform duration-300 hover:-translate-y-1 ${variant.rotate}`}
                    style={{ background: variant.bg }}
                  >
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-1"
                      style={{
                        width: "56px",
                        height: "18px",
                        background: "rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    />

                    <p
                      className="font-handwriting text-black leading-relaxed mb-5"
                      style={{
                        fontSize: "clamp(17px, 2vw, 22px)",
                        lineHeight: 1.55,
                      }}
                    >
                      "{message.content}"
                    </p>
                  </div>
                );
              })}
            </div>

            {messages.length === 0 && (
              <div className="text-center py-20">
                <p className="font-heading text-2xl text-gray-500">
                  No notes on the wall yet
                </p>
                <p className="font-body text-gray-600 mt-2">
                  Be the first one to leave a memory behind.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
