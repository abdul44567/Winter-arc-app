"use client";
import { useState, useEffect } from "react";
import { Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TrackerPage() {
  const totalDays = 90;
  const [mounted, setMounted] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);
  const [dayNotes, setDayNotes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [note, setNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedCompleted = JSON.parse(localStorage.getItem("completedDays") || "[]");
    const savedNotes = JSON.parse(localStorage.getItem("dayNotes") || "{}");
    setCompletedDays(savedCompleted);
    setDayNotes(savedNotes);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
      localStorage.setItem("dayNotes", JSON.stringify(dayNotes));
    }
  }, [completedDays, dayNotes, mounted]);

  const toggleDay = (day) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const openNote = (day) => {
    setSelectedDay(day);
    setNote(dayNotes[day] || "");
  };

  const saveNote = () => {
    setDayNotes((prev) => ({ ...prev, [selectedDay]: note }));
    setSelectedDay(null);
    setNote("");
  };

  const closeModal = () => {
    setSelectedDay(null);
    setNote("");
  };

  if (!mounted) return null;

  return (
    <section className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-30">
      <div>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-orange-400 mb-3">
            90-Day Tracker
          </h1>
          <p className="text-gray-300 max-w-md mx-auto">
            Mark each day you stay disciplined. Keep your Winter ARC journal ❄️
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              animate={{
                width: `${(completedDays.length / totalDays) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {completedDays.length} / {totalDays} days completed
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-5 sm:grid-cols-10 gap-4">
          {[...Array(totalDays)].map((_, i) => {
            const day = i + 1;
            const isCompleted = completedDays.includes(day);
            const hasNote = !!dayNotes[day];
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.08 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => toggleDay(day)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-300 ${
                    isCompleted
                      ? "bg-orange-500 border-orange-400 text-white scale-105"
                      : "border-gray-600 text-gray-400 hover:border-orange-400 hover:text-orange-300"
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : day}
                </button>
                <button
                  onClick={() => openNote(day)}
                  className="mt-1"
                  title="Add/View Note"
                >
                  <Info
                    size={18}
                    className={`transition-colors ${
                      hasNote
                        ? "text-orange-400"
                        : "text-gray-500 hover:text-orange-300"
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Motivation */}
        <p className="text-center text-gray-400 mt-12 italic">
          “Discipline is the bridge between goals and accomplishments.” 🌙
        </p>
      </div>

      {/* Bottom Button */}
      <div className="text-center mt-12 mb-10">
        <button
          onClick={() => router.push("/roles")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
        >
          View Daily Roles
        </button>
      </div>

      {/* Modal */}
      {selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1e293b] rounded-lg shadow-lg w-full max-w-md p-6"
          >
            <h2 className="text-xl font-bold mb-2 text-orange-400">
              Day {selectedDay} Reflection
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you accomplish today?"
              className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-orange-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 transition text-white font-medium"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
