import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getApiErrorMessage,
  getStudents,
  postMessage,
  updateStudent,
  uploadMemory,
  compressImage,
  uploadMemoriesParallel,
} from "../lib/yearbookApi";
import DEFAULT_CLASSMATES from "../data/defaultClassmates";

const YEAR_OPTIONS = [
  { value: "1st yr", label: "1st Year" },
  { value: "2nd yr", label: "2nd Year" },
  { value: "3rd yr", label: "3rd Year" },
  { value: "4th yr", label: "4th Year" },
];

const formCardStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.34) 100%)",
  boxShadow:
    "0 18px 38px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const fieldSurfaceStyle = {
  background: "rgba(10,10,9,0.78)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
};

const uploadPanelStyle = {
  background:
    "linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.02) 100%)",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #c9a84c 0%, #f0d67a 100%)",
  boxShadow: "0 16px 30px rgba(201,168,76,0.18)",
};

const EMPTY_STATUS = { type: "", message: "" };

function StatusMessage({ status }) {
  if (!status.message) return null;
  const color = status.type === "error" ? "text-[#f7c5c0]" : "text-[#d5d2a2]";
  return (
    <p className={`font-body text-xs leading-relaxed ${color}`}>
      {status.message}
    </p>
  );
}

export default function Yearbook() {
  const [students, setStudents] = useState(DEFAULT_CLASSMATES);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [memoryYear, setMemoryYear] = useState("1st yr");
  const [msgContent, setMsgContent] = useState("");
  const [nameVal, setNameVal] = useState("");
  const [rollVal, setRollVal] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [memoryFile, setMemoryFile] = useState(null);
  const [profileStatus, setProfileStatus] = useState(EMPTY_STATUS);
  const [memoryStatus, setMemoryStatus] = useState(EMPTY_STATUS);
  const [messageStatus, setMessageStatus] = useState(EMPTY_STATUS);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [memorySubmitting, setMemorySubmitting] = useState(false);
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [memoryFiles, setMemoryFiles] = useState([]);
  // Mobile modal tab state
  const [activeTab, setActiveTab] = useState("profile");

  const modalRef = useRef(null);
  const profileInputRef = useRef(null);
  const memoryInputRef = useRef(null);
  const messageLimit = 280;

  useEffect(() => {
    let ignore = false;
    async function loadStudents() {
      setStudentsLoading(true);
      setStudentsError("");
      try {
        const records = await getStudents();
        if (!ignore) {
          const sorted =
            records.length > 0
              ? records.sort((a, b) => {
                  const rollA = Number(String(a.roll).replace(/\D/g, "")) || 0;
                  const rollB = Number(String(b.roll).replace(/\D/g, "")) || 0;
                  return rollA - rollB;
                })
              : DEFAULT_CLASSMATES;
          setStudents(sorted);
        }
      } catch (error) {
        if (!ignore) {
          setStudentsError(
            getApiErrorMessage(
              error,
              "Backend not reachable right now. Showing built-in classmates.",
            ),
          );
          setStudents(DEFAULT_CLASSMATES);
        }
      } finally {
        if (!ignore) setStudentsLoading(false);
      }
    }
    loadStudents();
    return () => {
      ignore = true;
      document.body.style.overflow = "";
    };
  }, []);

  function clearTransientState() {
    setProfileImageFile(null);
    setMemoryFile(null);
    setMemoryFiles([]);
    setProfileStatus(EMPTY_STATUS);
    setMemoryStatus(EMPTY_STATUS);
    setMessageStatus(EMPTY_STATUS);
    if (profileInputRef.current) profileInputRef.current.value = "";
    if (memoryInputRef.current) memoryInputRef.current.value = "";
  }

  const filtered = students
    .filter((s) => {
      const matchSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        String(s.roll).includes(search);
      return matchSearch;
    })
    .sort((a, b) => {
      const rollA = Number(String(a.roll).replace(/\D/g, "")) || 0;
      const rollB = Number(String(b.roll).replace(/\D/g, "")) || 0;
      return rollA - rollB;
    });

  const openModal = (student) => {
    const selectedYear = YEAR_OPTIONS.some((o) => o.value === student.year)
      ? student.year
      : "1st yr";
    setSelectedStudent(student);
    setNameVal(student.name);
    setRollVal(String(student.roll));
    setMemoryYear(selectedYear);
    setMsgContent("");
    setActiveTab("profile");
    clearTransientState();
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedStudent(null);
    clearTransientState();
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        closeModal();
    };
    if (selectedStudent) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedStudent]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const trimmedName = nameVal.trim();
    const trimmedRoll = rollVal.trim();
    if (!trimmedName || !trimmedRoll) {
      setProfileStatus({
        type: "error",
        message: "Display name and roll number are both required.",
      });
      return;
    }
    setProfileSubmitting(true);
    setProfileStatus(EMPTY_STATUS);
    try {
      const updatedStudent = await updateStudent(selectedStudent._id, {
        name: trimmedName,
        roll: trimmedRoll,
        year: selectedStudent.year,
        imageFile: profileImageFile,
      });
      setStudents((curr) =>
        curr.map((s) => (s._id === updatedStudent._id ? updatedStudent : s)),
      );
      setSelectedStudent(updatedStudent);
      setNameVal(updatedStudent.name);
      setRollVal(String(updatedStudent.roll));
      setProfileImageFile(null);
      if (profileInputRef.current) profileInputRef.current.value = "";
      setProfileStatus({
        type: "success",
        message: "Profile saved to the yearbook.",
      });
    } catch (error) {
      setProfileStatus({
        type: "error",
        message: getApiErrorMessage(error, "Could not save this profile yet."),
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleMemoryUpload = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const filesToUpload =
      memoryFiles.length > 0 ? memoryFiles : memoryFile ? [memoryFile] : [];
    if (filesToUpload.length === 0) {
      setMemoryStatus({
        type: "error",
        message: "Choose photo or video(s) before uploading.",
      });
      return;
    }

    const totalSize = filesToUpload.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      setMemoryStatus({
        type: "error",
        message:
          "Total file size exceeds 100MB. Please select smaller files or fewer files.",
      });
      return;
    }

    setMemorySubmitting(true);
    setMemoryStatus(EMPTY_STATUS);

    try {
      setMemoryStatus({
        type: "info",
        message: "Compressing images and preparing upload...",
      });

      // Compress images first
      const compressedFiles = await Promise.all(
        filesToUpload.map(async (file) => {
          if (file.type.startsWith("image/")) {
            return await compressImage(file, 5);
          }
          return file;
        }),
      );

      // Prepare upload payloads
      const payloads = compressedFiles.map((file, idx) => {
        const fileType = file.type.startsWith("image/") ? "photo" : "video";
        return {
          file,
          caption: `${selectedStudent.name} - ${memoryYear} (${fileType})`,
          year: memoryYear,
          uploadedBy: selectedStudent.name,
          studentId: selectedStudent._id,
          studentName: selectedStudent.name,
        };
      });

      // Upload in parallel (2 at a time)
      setMemoryStatus({
        type: "info",
        message: `📤 Uploading ${payloads.length} file(s) to Media Vault...`,
      });

      const { results, errors } = await uploadMemoriesParallel(payloads);

      setMemoryFile(null);
      setMemoryFiles([]);
      if (memoryInputRef.current) memoryInputRef.current.value = "";

      if (errors.length === 0) {
        setMemoryStatus({
          type: "success",
          message: `✅ Successfully uploaded ${results.length} file(s) to Media Vault for ${memoryYear}!`,
        });
      } else if (results.length > 0) {
        setMemoryStatus({
          type: "warning",
          message: `⚠️ Uploaded ${results.length}/${payloads.length} file(s). Failed: ${errors.map((e) => e.file).join(", ")}`,
        });
      } else {
        setMemoryStatus({
          type: "error",
          message: `❌ All uploads failed. ${errors[0]?.error?.message || "Please try again."}`,
        });
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error, "Could not upload memories.");
      setMemoryStatus({
        type: "error",
        message: `❌ Upload failed: ${errorMsg}`,
      });
    } finally {
      setMemorySubmitting(false);
    }
  };

  const handleMessagePost = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const trimmedMessage = msgContent.trim();
    if (!trimmedMessage) {
      setMessageStatus({
        type: "error",
        message: "Write a short note before posting.",
      });
      return;
    }
    setMessageSubmitting(true);
    setMessageStatus(EMPTY_STATUS);
    try {
      await postMessage({
        content: trimmedMessage,
        toName: selectedStudent.name,
        toStudentId: selectedStudent._id,
      });
      setMsgContent("");
      setMessageStatus({
        type: "success",
        message: "Note posted to The Wall.",
      });
    } catch (error) {
      setMessageStatus({
        type: "error",
        message: getApiErrorMessage(error, "Could not post that note yet."),
      });
    } finally {
      setMessageSubmitting(false);
    }
  };

  /* ── TAB CONFIG for mobile ── */
  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "memory", label: "Memory" },
    { id: "note", label: "Note" },
  ];

  return (
    <div
      className="min-h-screen text-off-white"
      style={{ background: "#111110" }}
    >
      <Navbar />

      {/* ── HERO ── */}
      <div className="text-center py-10 sm:py-14 lg:py-16 px-4">
        <h1
          className="font-heading font-bold text-off-white mb-3 sm:mb-4"
          style={{ fontSize: "clamp(32px, 7vw, 80px)" }}
        >
          The Class of '26
        </h1>
        <p className="text-gray-400 font-body max-w-xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-4">
          Faces that defined our journey. Moments that became memories. Click a
          card to update a profile, upload a memory, or post a note to the wall.
        </p>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Find a classmate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-body text-off-white placeholder-gray-500 outline-none transition-all duration-200 w-full sm:w-64"
              style={{
                background: "#1a1a18",
                border: "1px solid #2e2e2b",
                borderRadius: "999px",
                padding: "10px 18px 10px 38px",
                fontSize: "15px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
              onBlur={(e) => (e.target.style.borderColor = "#2e2e2b")}
            />
          </div>
        </div>

        {studentsError && (
          <div
            className="mb-6 rounded-2xl px-4 py-3 font-body text-sm"
            style={{
              border: "1px solid rgba(186, 93, 82, 0.45)",
              background: "rgba(79, 26, 22, 0.4)",
              color: "#f7c5c0",
            }}
          >
            {studentsError}
          </div>
        )}

        {studentsLoading && (
          <p className="mb-6 font-body text-sm text-gray-500">
            Syncing classmates with the backend...
          </p>
        )}

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* ── GRID ── */}
      {/*
        Responsive grid:
        - Mobile (< sm)  → 2 columns, shorter cards
        - Tablet (sm–lg) → 3 columns
        - Desktop (lg+)  → 4 columns
        - XL (2xl+)      → 5 columns
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((student) => (
            <div
              key={student._id}
              onClick={() => openModal(student)}
              className="relative group cursor-pointer overflow-hidden transition-all duration-400"
              style={{ borderRadius: "6px", border: "1px solid #252522" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#c9a84c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#252522")
              }
            >
              <img
                src={
                  student.image || "https://picsum.photos/seed/default/300/400"
                }
                alt={student.name}
                className="w-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-[1.03]"
                style={{ height: "clamp(180px, 30vw, 320px)" }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://picsum.photos/seed/default/300/400";
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-full p-2 sm:p-3 md:p-4"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                }}
              >
                <h2 className="font-heading text-gold truncate text-sm sm:text-base md:text-lg">
                  {student.name}
                </h2>
                <p className="text-gray-400 font-body text-xs">
                  Roll {student.roll}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading text-xl sm:text-2xl text-gray-600">
              No classmates found
            </p>
            <p className="font-body text-gray-500 mt-2 text-sm sm:text-base">
              Try a different search or let the backend finish loading.
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center sm:items-center justify-center overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.92)", padding: "0" }}
        >
          {/*
            Modal sizing:
            - Mobile      → full-width bottom sheet, max-h 92vh, scroll inside
            - Tablet (sm) → centered card, 95vw, rounded all sides
            - Desktop (lg)→ max-w-5xl, normal modal
          */}
          <div
            ref={modalRef}
            className="relative w-full sm:w-[95vw] lg:w-full sm:max-w-2xl lg:max-w-5xl overflow-hidden
                       rounded-t-[24px] sm:rounded-[24px]
                       max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
            style={{
              background: "linear-gradient(135deg, #1a1916 0%, #0f0e0b 100%)",
              border: "1px solid #c9a84c66",
              boxShadow: "0 20px 60px rgba(201,168,76,0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-gold transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(10, 10, 9, 0.72)",
                border: "1px solid rgba(212,175,55,0.2)",
                backdropFilter: "blur(10px)",
              }}
              aria-label="Close modal"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="relative overflow-hidden border-b border-gold/15 px-4 py-4 sm:px-6 sm:py-5">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(212,175,55,0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent 32%)",
                }}
              />
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gold/30 blur-xl" />
                  <img
                    src={
                      selectedStudent.image ||
                      "https://picsum.photos/seed/default/300/400"
                    }
                    alt={selectedStudent.name}
                    className="relative h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-full border-2 border-gold/70 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://picsum.photos/seed/default/300/400";
                    }}
                  />
                </div>
                <div className="text-left min-w-0">
                  <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-gold truncate pr-8">
                    {selectedStudent.name}
                  </h2>
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-0.5 font-body text-[11px] text-off-white">
                      Roll {selectedStudent.roll}
                    </span>
                    <span className="font-body text-xs text-gray-400 hidden sm:inline">
                      Live yearbook record
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MOBILE: Tab switcher ── */}
            <div className="flex lg:hidden border-b border-gold/15 bg-black/20">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2.5 font-body text-xs sm:text-sm font-semibold transition-all duration-200"
                  style={{
                    color: activeTab === tab.id ? "#c9a84c" : "#6b7280",
                    borderBottom:
                      activeTab === tab.id
                        ? "2px solid #c9a84c"
                        : "2px solid transparent",
                    background: "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── BODY ── */}
            <div className="p-3 sm:p-4 lg:p-5 flex flex-col lg:block">
              {/* Desktop: 3-column grid */}
              <div className="hidden lg:grid gap-4 lg:grid-cols-3">
                <ProfileCard
                  nameVal={nameVal}
                  setNameVal={setNameVal}
                  rollVal={rollVal}
                  setRollVal={setRollVal}
                  profileInputRef={profileInputRef}
                  profileStatus={profileStatus}
                  setProfileStatus={setProfileStatus}
                  profileSubmitting={profileSubmitting}
                  setProfileImageFile={setProfileImageFile}
                  handleProfileUpdate={handleProfileUpdate}
                  formCardStyle={formCardStyle}
                  fieldSurfaceStyle={fieldSurfaceStyle}
                  uploadPanelStyle={uploadPanelStyle}
                  primaryButtonStyle={primaryButtonStyle}
                />
                <MemoryCard
                  memoryInputRef={memoryInputRef}
                  memoryFiles={memoryFiles}
                  setMemoryFiles={setMemoryFiles}
                  memoryFile={memoryFile}
                  setMemoryFile={setMemoryFile}
                  memoryYear={memoryYear}
                  setMemoryYear={setMemoryYear}
                  memoryStatus={memoryStatus}
                  setMemoryStatus={setMemoryStatus}
                  memorySubmitting={memorySubmitting}
                  handleMemoryUpload={handleMemoryUpload}
                  formCardStyle={formCardStyle}
                  fieldSurfaceStyle={fieldSurfaceStyle}
                  uploadPanelStyle={uploadPanelStyle}
                />
                <NoteCard
                  msgContent={msgContent}
                  setMsgContent={setMsgContent}
                  messageLimit={messageLimit}
                  messageStatus={messageStatus}
                  setMessageStatus={setMessageStatus}
                  messageSubmitting={messageSubmitting}
                  handleMessagePost={handleMessagePost}
                  formCardStyle={formCardStyle}
                />
              </div>

              {/* Mobile / Tablet: tab-based single panel */}
              <div className="lg:hidden w-full max-w-lg mx-auto">
                {activeTab === "profile" && (
                  <ProfileCard
                    nameVal={nameVal}
                    setNameVal={setNameVal}
                    rollVal={rollVal}
                    setRollVal={setRollVal}
                    profileInputRef={profileInputRef}
                    profileStatus={profileStatus}
                    setProfileStatus={setProfileStatus}
                    profileSubmitting={profileSubmitting}
                    setProfileImageFile={setProfileImageFile}
                    handleProfileUpdate={handleProfileUpdate}
                    formCardStyle={formCardStyle}
                    fieldSurfaceStyle={fieldSurfaceStyle}
                    uploadPanelStyle={uploadPanelStyle}
                    primaryButtonStyle={primaryButtonStyle}
                  />
                )}
                {activeTab === "memory" && (
                  <MemoryCard
                    memoryInputRef={memoryInputRef}
                    memoryFiles={memoryFiles}
                    setMemoryFiles={setMemoryFiles}
                    memoryFile={memoryFile}
                    setMemoryFile={setMemoryFile}
                    memoryYear={memoryYear}
                    setMemoryYear={setMemoryYear}
                    memoryStatus={memoryStatus}
                    setMemoryStatus={setMemoryStatus}
                    memorySubmitting={memorySubmitting}
                    handleMemoryUpload={handleMemoryUpload}
                    formCardStyle={formCardStyle}
                    fieldSurfaceStyle={fieldSurfaceStyle}
                    uploadPanelStyle={uploadPanelStyle}
                  />
                )}
                {activeTab === "note" && (
                  <NoteCard
                    msgContent={msgContent}
                    setMsgContent={setMsgContent}
                    messageLimit={messageLimit}
                    messageStatus={messageStatus}
                    setMessageStatus={setMessageStatus}
                    messageSubmitting={messageSubmitting}
                    handleMessagePost={handleMessagePost}
                    formCardStyle={formCardStyle}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Sub-components (extracted for cleanliness)
══════════════════════════════════════════ */

function ProfileCard({
  nameVal,
  setNameVal,
  rollVal,
  setRollVal,
  profileInputRef,
  profileStatus,
  setProfileStatus,
  profileSubmitting,
  setProfileImageFile,
  handleProfileUpdate,
  formCardStyle,
  fieldSurfaceStyle,
  uploadPanelStyle,
  primaryButtonStyle,
}) {
  return (
    <div
      className="rounded-[22px] border border-gold/18 p-4 sm:p-5"
      style={formCardStyle}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="font-heading text-lg sm:text-xl text-gold">
          Update Your Profile
        </h3>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        {/* Name + Roll: stacked on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <label className="block space-y-2">
            <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
              Display Name
            </span>
            <input
              type="text"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="w-full rounded-xl border border-gold/20 px-3.5 py-2.5 font-body text-sm text-off-white outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-gold/60"
              placeholder="Your name"
              style={fieldSurfaceStyle}
            />
          </label>
          <label className="block space-y-2">
            <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
              Roll Number
            </span>
            <input
              type="text"
              value={rollVal}
              onChange={(e) => setRollVal(e.target.value)}
              className="w-full rounded-xl border border-gold/20 px-3.5 py-2.5 font-body text-sm text-off-white outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-gold/60"
              placeholder="Roll number"
              style={fieldSurfaceStyle}
            />
          </label>
        </div>

        <label className="block space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
              Profile Picture
            </span>
            <span className="font-body text-xs text-gray-500">
              JPG, PNG, WebP
            </span>
          </div>
          <div
            className="rounded-xl border border-dashed border-gold/25 p-3"
            style={uploadPanelStyle}
          >
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProfileImageFile(e.target.files?.[0] || null);
                setProfileStatus(EMPTY_STATUS);
              }}
              className="block w-full font-body text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:font-body file:text-sm file:font-semibold file:text-gold file:transition-all hover:file:bg-gold/30"
            />
          </div>
        </label>

        <StatusMessage status={profileStatus} />

        <div className="border-t border-white/6 pt-3">
          <button
            type="submit"
            disabled={profileSubmitting}
            className="w-full rounded-xl px-5 py-2.5 font-heading text-sm font-bold text-matte-black transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            style={primaryButtonStyle}
          >
            {profileSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MemoryCard({
  memoryInputRef,
  memoryFiles,
  setMemoryFiles,
  memoryFile,
  setMemoryFile,
  memoryYear,
  setMemoryYear,
  memoryStatus,
  setMemoryStatus,
  memorySubmitting,
  handleMemoryUpload,
  formCardStyle,
  fieldSurfaceStyle,
  uploadPanelStyle,
}) {
  return (
    <div
      className="rounded-[22px] border border-gold/18 p-4 sm:p-5"
      style={formCardStyle}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h4l2-2h4l2 2h4" />
            <path d="M5 7h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <h3 className="font-heading text-lg sm:text-xl text-gold">
          Upload Memory
        </h3>
      </div>

      <form onSubmit={handleMemoryUpload} className="space-y-4">
        <label className="block space-y-2">
          <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
            Photo or Video
          </span>
          <div
            className="rounded-xl border border-dashed border-gold/25 p-3"
            style={uploadPanelStyle}
          >
            <input
              ref={memoryInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                setMemoryFiles(Array.from(e.target.files || []));
                setMemoryStatus(EMPTY_STATUS);
              }}
              className="block w-full font-body text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-gold/20 file:px-3 file:py-2 file:font-body file:text-sm file:font-semibold file:text-gold file:transition-all hover:file:bg-gold/30"
            />
            {memoryFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="font-body text-xs text-gold font-semibold">
                  📋 Preview: {memoryFiles.length} file(s) selected
                </p>
                {/* Grid: 2 cols on mobile, 3 cols on sm+ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-2 bg-black/20 rounded-lg">
                  {memoryFiles.map((file, idx) => {
                    const isImage = file.type.startsWith("image/");
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                    const fileUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden border border-gold/20 bg-black"
                      >
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={file.name}
                            className="w-full h-24 sm:h-28 object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-24 sm:h-28 bg-gray-900 flex items-center justify-center">
                            <video
                              src={fileUrl}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-2xl">▶️</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <p className="font-body text-xs text-gold text-center truncate w-full">
                            {file.name}
                          </p>
                          <p className="font-body text-[10px] text-gray-300">
                            {fileSize} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(fileUrl);
                            setMemoryFiles(
                              memoryFiles.filter((_, i) => i !== idx),
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </label>

        <label className="block space-y-2">
          <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
            Memory Year
          </span>
          <div className="relative">
            <select
              value={memoryYear}
              onChange={(e) => setMemoryYear(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gold/20 px-3.5 py-2.5 pr-11 font-body text-sm text-off-white outline-none transition-all duration-300 focus:border-gold/60"
              style={fieldSurfaceStyle}
            >
              {YEAR_OPTIONS.map((yr) => (
                <option
                  key={yr.value}
                  value={yr.value}
                  style={{ background: "#1a1916" }}
                >
                  {yr.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gold/70">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </label>

        <StatusMessage status={memoryStatus} />

        <div className="border-t border-white/6 pt-3">
          <button
            type="submit"
            disabled={memorySubmitting}
            className="w-full rounded-xl border border-gold/35 bg-gold/10 px-5 py-2.5 font-heading text-sm font-bold text-gold transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-matte-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {memorySubmitting ? "Uploading..." : "Upload to Vault"}
          </button>
        </div>
      </form>
    </div>
  );
}

function NoteCard({
  msgContent,
  setMsgContent,
  messageLimit,
  messageStatus,
  setMessageStatus,
  messageSubmitting,
  handleMessagePost,
  formCardStyle,
}) {
  return (
    <div
      className="rounded-[22px] border border-gold/18 p-4 sm:p-5 "
      style={formCardStyle}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 10h8" />
            <path d="M8 14h5" />
            <path d="M12 3c-4.4 0-8 2.91-8 6.5 0 2.14 1.27 4.03 3.24 5.2L6 21l5.12-2.78c.29.03.58.04.88.04 4.42 0 8-2.91 8-6.5S16.42 3 12 3Z" />
          </svg>
        </div>
        <h3 className="font-heading text-lg sm:text-xl text-gold">
          Leave a Note
        </h3>
      </div>

      <form onSubmit={handleMessagePost} className="space-y-4">
        <label className="block space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-body text-xs uppercase tracking-[0.24em] text-gold/70">
              ✍️ Anonymous Message
            </span>
            <span
              className={`font-body text-xs font-semibold transition-all ${msgContent.length > messageLimit * 0.8 ? "text-orange-300" : "text-gray-400"}`}
            >
              {msgContent.length}/{messageLimit}
            </span>
          </div>
          <textarea
            value={msgContent}
            onChange={(e) => {
              setMsgContent(e.target.value);
              setMessageStatus(EMPTY_STATUS);
            }}
            rows={4}
            maxLength={messageLimit}
            placeholder="Write a short note..."
            required
            className="w-full resize-none rounded-2xl px-4 py-3 font-handwriting text-base leading-relaxed outline-none placeholder:text-amber-700/60 focus:ring-2 focus:ring-amber-400/60 transition-all duration-300"
            style={{
              color: "#3d2817",
              background:
                "linear-gradient(135deg, #fffaed 0%, #fff8e5 50%, #fffcf0 100%)",
              border: "1.5px solid #f0e5cc",
              boxShadow:
                "inset 0 3px 10px rgba(0,0,0,0.08), 0 4px 12px rgba(255,193,7,0.15), inset 0 0 0 1px rgba(255,255,255,0.4)",
              fontFamily: "cursive",
              letterSpacing: "0.3px",
            }}
          />
        </label>

        <StatusMessage status={messageStatus} />

        <div className="border-t border-white/6 pt-3">
          <button
            type="submit"
            disabled={messageSubmitting}
            className="w-full rounded-xl px-5 py-3 font-heading text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            style={{
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f97316 100%)",
              boxShadow:
                "0 10px 25px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            {messageSubmitting ? "✍️ Posting..." : "💬 Post to The Wall"}
          </button>
        </div>
      </form>
    </div>
  );
}
