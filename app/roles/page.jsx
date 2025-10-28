"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  RefreshCw,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_ROLES = [
  "Wake up before sunrise",
  "Go for an outdoor walk",
  "Take a cold shower",
  "Fajr prayer",
  "Qur’an tilawat (15–20 min)",
  "Exercise twice a day",
  "Better sleep (8 hours)",
];

export default function WinterArcRoles() {
  const router = useRouter();

  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [checked, setChecked] = useState(DEFAULT_ROLES.map(() => false));
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [currentDay, setCurrentDay] = useState(0);
  const [newRole, setNewRole] = useState("");
  const [mounted, setMounted] = useState(false);

  const threshold = 12;
  const totalDays = 90;

  const calculateDay = (start) => {
    const s = new Date(start);
    const t = new Date();
    const diff = Math.floor((t - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff <= totalDays ? diff : totalDays;
  };

  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem("rolesData") || "{}");
    if (saved.roles) setRoles(saved.roles);
    if (saved.checked) setChecked(saved.checked);
    if (saved.note) setNote(saved.note);
    if (saved.startDate) {
      setStartDate(saved.startDate);
      setCurrentDay(calculateDay(saved.startDate));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      "rolesData",
      JSON.stringify({ roles, checked, note, startDate })
    );
  }, [roles, checked, note, startDate, mounted]);

  const toggleCheck = (i) =>
    setChecked((prev) => prev.map((v, idx) => (i === idx ? !v : v)));

  const addRole = () => {
    const r = newRole.trim();
    if (!r) return alert("Enter a valid role name.");
    if (roles.includes(r)) return alert("Role already exists.");
    setRoles([...roles, r]);
    setChecked([...checked, false]);
    setNewRole("");
  };

  const removeRole = (i) => {
    if (!confirm(`Remove "${roles[i]}" from your roles?`)) return;
    setRoles((prev) => prev.filter((_, idx) => idx !== i));
    setChecked((prev) => prev.filter((_, idx) => idx !== i));
  };

  const resetAll = () => {
    if (!confirm("Reset today's checklist?")) return;
    setChecked(roles.map(() => false));
    setNote("");
    localStorage.removeItem("rolesData");
  };

  const setDate = () => {
    if (!customDate) return alert("Please select a start date first!");
    setStartDate(customDate);
    setCurrentDay(calculateDay(customDate));
    alert("✅ Start date set successfully!");
  };

  const completed = checked.filter(Boolean).length;
  const percent = Math.round((completed / roles.length) * 100);
  const canComplete = completed >= threshold;

  const markComplete = () => {
    if (!canComplete)
      return alert(
        `Complete at least ${threshold}/${roles.length} tasks first.`
      );
    const key = "completedDays";
    const days = JSON.parse(localStorage.getItem(key) || "[]");
    if (days.includes(currentDay)) return alert("Already marked complete.");
    days.push(currentDay);
    localStorage.setItem(key, JSON.stringify(days));
    alert("✅ Day marked complete!");
  };

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 bg-[#0f172a]/70 border border-gray-800 rounded-2xl p-6 shadow-lg backdrop-blur-md">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-orange-400">
              ❄️ Winter Arc Rules
            </h1>
            <p className="text-gray-400 mt-1">
              {startDate
                ? `Day ${currentDay} · Started on ${new Date(
                    startDate
                  ).toDateString()}`
                : "No start date set"}
            </p>
          </div>

          <button
            onClick={resetAll}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#1e293b]/60 border border-gray-700 rounded-md hover:bg-[#1e293b]/80"
          >
            <RefreshCw size={16} />
            <span className="text-sm text-gray-200">Reset</span>
          </button>
        </header>

        {/* Start Date Selector */}
        {!startDate && (
          <div className="bg-[#1e293b]/70 border border-gray-700 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Calendar size={20} className="text-orange-400" />
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-transparent border border-gray-600 rounded-md px-3 py-2 text-white focus:border-orange-400"
            />
            <button
              onClick={setDate}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md font-semibold"
            >
              Set Start
            </button>
          </div>
        )}

        {/* Add Role Input */}
        {startDate && (
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Add new custom role..."
              className="flex-1 bg-[#1e293b]/70 border border-gray-700 rounded-md px-4 py-2 text-gray-100 focus:border-orange-400"
            />
            <button
              onClick={addRole}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-semibold"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {startDate && (
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
                Target: {threshold}/{roles.length}
              </span>
            </div>
          </div>
        )}

        {/* Roles List */}
        {startDate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`p-4 rounded-xl border transition-all relative group ${
                  checked[i]
                    ? "bg-gradient-to-r from-[#123] to-[#17202a] border-orange-400/30"
                    : "bg-[#0f172a]/40 border-[#1f2a33]"
                }`}
              >
                <div className="flex items-center">
                  <label
                    onClick={() => toggleCheck(i)}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all ${
                        checked[i]
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-500"
                      }`}
                    >
                      {checked[i] && <Check size={14} className="text-white" />}
                    </div>
                    <span
                      className={`text-sm sm:text-base ${
                        checked[i]
                          ? "text-gray-400 line-through"
                          : "text-gray-100"
                      }`}
                    >
                      {role}
                    </span>
                  </label>
                  <button
                    onClick={() => removeRole(i)}
                    className="absolute right-5 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                    title="Remove role"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Note Section */}
        {startDate && (
          <div className="bg-[#1e293b]/60 rounded-xl p-4 border border-[#2a3942] mb-6">
            <label className="text-sm text-gray-300 mb-2 block">
              Daily Note / Reflection
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your reflection..."
              className="w-full min-h-[96px] p-3 bg-[#0b1220] border border-gray-700 rounded-lg text-gray-200 focus:border-orange-400 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={markComplete}
                disabled={!canComplete}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  canComplete
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                Mark Day Complete
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e293b]/60 border border-gray-700 rounded-full text-gray-200 hover:text-white hover:border-orange-500 hover:bg-[#1e293b]/80 font-semibold"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </section>
  );
}
