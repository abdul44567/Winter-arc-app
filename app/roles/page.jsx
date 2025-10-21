"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, RefreshCw, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const ROLES = [
  "Cold shower",
  "Fajr prayer",
  "Qur’an tilawat (15–20 min)",
  "Morning walk (15–30 min)",
  "Healthy breakfast",
  "Start office on time (11:15 AM)",
  "Productive work session (focused)",
  "Lunch break (3–4 PM)",
  "Resume focused work",
  "Gym (8:30–9:30 PM)",
  "Post-gym meal / recovery",
  "Quality time with parents",
  "Night reflection / journaling",
  "Sleep on time (consistent)",
];

export default function WinterArcRoles() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(ROLES.map(() => false));
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [currentDay, setCurrentDay] = useState(0);

  const total = ROLES.length;
  const threshold = 12;
  const totalDays = 90;

  // Calculate day difference
  const calculateDay = (start) => {
    const sDate = new Date(start);
    const today = new Date();
    const diffTime = today.getTime() - sDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays <= totalDays ? diffDays : totalDays;
  };

  // Load saved data
  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem("rolesData") || "{}");
    if (saved.checked?.length === total) setChecked(saved.checked);
    if (saved.note) setNote(saved.note);
    if (saved.startDate) {
      setStartDate(saved.startDate);
      setCurrentDay(calculateDay(saved.startDate));
    }
  }, []);

  // Save data
  useEffect(() => {
    if (!mounted) return;
    const payload = { checked, note, startDate };
    localStorage.setItem("rolesData", JSON.stringify(payload));
  }, [checked, note, startDate, mounted]);

  // Toggle checklist item
  const toggle = (i) =>
    setChecked((prev) => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });

  // Reset checklist
  const resetToday = () => {
    if (!confirm("Reset today's checklist?")) return;
    setChecked(ROLES.map(() => false));
    setNote("");
    localStorage.removeItem("rolesData");
  };

  // Handle start date setup
  const handleSetStartDate = () => {
    if (!customDate) {
      alert("Please select a start date first!");
      return;
    }
    setStartDate(customDate);
    localStorage.setItem(
      "rolesData",
      JSON.stringify({ checked, note, startDate: customDate })
    );
    setCurrentDay(calculateDay(customDate));
    alert("✅ Start date set successfully!");
  };

  const completedCount = checked.filter(Boolean).length;
  const percent = Math.round((completedCount / total) * 100);
  const canMarkComplete = completedCount >= threshold;

  // Mark day complete
  const markDayComplete = () => {
    if (!canMarkComplete) {
      alert(`Complete at least ${threshold}/${total} tasks before marking the day complete.`);
      return;
    }
    const key = "completedDays";
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    if (!arr.includes(currentDay)) {
      arr.push(currentDay);
      localStorage.setItem(key, JSON.stringify(arr));
      alert("✅ Day marked complete!");
    } else {
      alert("This day is already marked complete.");
    }
  };

  if (!mounted) return null;

  return (
    <section className="min-h-screen py-30 px-6 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-orange-400">
              Winter ARC — Daily Roles
            </h1>
            {startDate ? (
              <p className="text-gray-300 mt-1">
                Day {currentDay} · Started on {new Date(startDate).toDateString()}
              </p>
            ) : (
              <p className="text-gray-400 mt-1">No start date set</p>
            )}
          </div>
          <button
            onClick={resetToday}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-[#1e293b]/60 border border-gray-700 rounded-md hover:bg-[#1e293b]/80 transition"
          >
            <RefreshCw size={16} />
            <span className="text-sm text-gray-200">Reset</span>
          </button>
        </div>

        {/* Start Date Selector */}
        {!startDate && (
          <div className="bg-[#1e293b]/70 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-orange-400" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-transparent border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none"
              />
              <button
                onClick={handleSetStartDate}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition font-semibold"
              >
                Set Start
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        {startDate && (
          <>
            <div className="mb-6">
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{percent}%</span>
                <span>
                  Target: {threshold}/{total}
                </span>
              </div>
            </div>

            {/* Roles checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {ROLES.map((role, i) => (
                <motion.div
                  key={role}
                  whileHover={{ y: -5 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-100 ${
                    checked[i]
                      ? "bg-gradient-to-r from-[#123] to-[#17202a] border-orange-400/30"
                      : "bg-[#0f172a]/40 border-[#1f2a33]"
                  }`}
                >
                  <label
                    className="flex items-center gap-3 cursor-pointer select-none w-full"
                    onClick={() => toggle(i)}
                  >
                    <div
                      className={`relative flex items-center justify-center w-5 h-5 rounded-md border transition-all ${
                        checked[i]
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-500 bg-transparent"
                      }`}
                    >
                      {checked[i] && (
                        <Check size={14} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div
                      className={`text-sm sm:text-base ${
                        checked[i]
                          ? "text-gray-300 line-through"
                          : "text-gray-100"
                      }`}
                    >
                      {role}
                    </div>
                  </label>
                </motion.div>
              ))}
            </div>

            {/* Notes */}
            <div className="bg-[#1e293b]/60 rounded-xl p-4 mb-6 border border-[#2a3942]">
              <label className="text-sm text-gray-300 mb-2 block">
                Daily Note / Reflection
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your reflection..."
                className="w-full min-h-[96px] p-3 bg-[#0b1220] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-orange-400 resize-none"
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={markDayComplete}
                  disabled={!canMarkComplete}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    canMarkComplete
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Mark Day Complete
                </button>
              </div>
            </div>
          </>
        )}

        {/* Go Back */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e293b]/60 border border-gray-700 rounded-full text-gray-200 hover:text-white hover:border-orange-500 hover:bg-[#1e293b]/80 transition font-semibold"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div> 
    </section>
  );
}
