"use client";
import { useState, useEffect, useRef } from "react";
import {
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiPlus,
  FiSmile,
} from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

// Default Winter ARC Schedule
const defaultSchedule = [
  { time: "4:30 AM", task: "Fajr Namaz & Qur'an Recitation", emoji: "🕌" },
  { time: "6:00 AM", task: "Morning Walk & Refresh", emoji: "🌅" },
  { time: "7:00 AM", task: "Breakfast & Light Reading", emoji: "☕" },
  { time: "9:00 AM", task: "Web Development (Next.js + TypeScript)", emoji: "💻" },
  { time: "12:00 PM", task: "Lunch & Short Break", emoji: "🍽️" },
  { time: "1:00 PM", task: "Zohar Prayer & Rest", emoji: "🕌" },
  { time: "3:00 PM", task: "Revising Code / Practice", emoji: "📚" },
  { time: "5:00 PM", task: "Asr Prayer & Walk", emoji: "🕌" },
  { time: "6:00 PM", task: "Mini Project / Creative Coding", emoji: "🛠️" },
  { time: "8:00 PM", task: "Dinner & Family Time", emoji: "🍛" },
  { time: "9:21 PM", task: "Isha Prayer & Wind Down", emoji: "🕋" },
  { time: "10:00 PM", task: "Sleep & Recharge", emoji: "😴" },
];

const STORAGE_KEY = "winterArcSchedule";

const timeToNumber = (timeStr) => {
  const [time, period] = timeStr.trim().split(" ");
  const [h, m] = time.split(":").map(Number);
  let hour24 = h % 12;
  if (period?.toUpperCase() === "PM") hour24 += 12;
  return hour24 * 60 + m;
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [newEntry, setNewEntry] = useState({ time: "", task: "", emoji: "" });
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(null);

  // Load data from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
        return;
      } catch {}
    }
    setSchedule(defaultSchedule);
  }, []);

  // Save whenever schedule changes
  useEffect(() => {
    if (schedule.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    }
  }, [schedule]);

  const handleAdd = () => {
    const { time, task, emoji } = newEntry;
    if (!time || !task || !emoji) return setError("⚠️ All fields are required!");
    const updated = [...schedule, newEntry].sort(
      (a, b) => timeToNumber(a.time) - timeToNumber(b.time)
    );
    setSchedule(updated);
    setNewEntry({ time: "", task: "", emoji: "" });
    setError(null);
  };

  const handleEditSave = () => {
    if (!editingEntry) return;
    const updated = [...schedule];
    updated[editingIdx] = editingEntry;
    setSchedule(
      updated.sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
    );
    setEditingIdx(null);
    setEditingEntry(null);
  };

  const resetToDefault = () => {
    if (confirm("Reset to Winter ARC default schedule?")) {
      setSchedule(defaultSchedule);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSchedule));
    }
  };

  const handleDelete = (idx) => {
    if (confirm("Remove this task?")) {
      setSchedule(schedule.filter((_, i) => i !== idx));
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-30">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-orange-400 mb-3">
            Winter ARC Daily Schedule
          </h1>
          <p className="text-gray-300 max-w-md mx-auto">
            Manage, edit, and track your daily Winter ARC routine.
          </p>
        </div>

        {/* Add New Task */}
        <div className="bg-[#1e293b] rounded-xl p-5 mb-8 shadow-lg border border-gray-700 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-orange-400">Add New Task</h2>
            <button
              onClick={resetToDefault}
              className="text-sm text-red-400 hover:text-red-500 transition"
            >
              Reset Default
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-2xl border border-gray-600"
              >
                {newEntry.emoji || <FiSmile className="text-gray-400" />}
              </button>
              {showPicker && (
                <div className="absolute z-50 top-12">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setNewEntry({ ...newEntry, emoji: e.emoji });
                      setShowPicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Time Input */}
            <input
              type="text"
              placeholder="e.g. 6:00 AM"
              className="w-32 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-400 text-white"
              value={newEntry.time}
              onChange={(e) =>
                setNewEntry({ ...newEntry, time: e.target.value })
              }
            />

            {/* Task Input */}
            <input
              type="text"
              placeholder="Your task"
              className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-400 text-white"
              value={newEntry.task}
              onChange={(e) =>
                setNewEntry({ ...newEntry, task: e.target.value })
              }
            />

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="bg-orange-500 hover:bg-orange-600 transition text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 flex justify-between items-center hover:border-orange-400 transition-all"
            >
              {editingIdx === idx ? (
                <div className="flex gap-2 w-full items-center">
                  <input
                    className="w-12 text-center rounded bg-gray-800 text-white border border-gray-600"
                    value={editingEntry?.emoji || ""}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        emoji: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-24 p-1 rounded bg-gray-800 text-white border border-gray-600"
                    value={editingEntry?.time || ""}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        time: e.target.value,
                      })
                    }
                  />
                  <input
                    className="flex-1 p-1 rounded bg-gray-800 text-white border border-gray-600"
                    value={editingEntry?.task || ""}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        task: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={handleEditSave}
                    className="text-green-500 hover:text-green-400"
                  >
                    <FiSave />
                  </button>
                  <button
                    onClick={() => {
                      setEditingIdx(null);
                      setEditingEntry(null);
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="font-semibold text-orange-300">
                        {item.time}
                      </p>
                      <p className="text-gray-300">{item.task}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingIdx(idx);
                        setEditingEntry(item);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
