"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

// -----------------------------
// CurrentDayTracker Component
// -----------------------------
function CurrentDayTracker({ isMobile = false }) {
  const totalDays = 90;
  const [startDate, setStartDate] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [daysUntilStart, setDaysUntilStart] = useState(null);

  // Load saved start date (from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("arcStartDate");
    if (saved) {
      const date = new Date(saved);
      if (!isNaN(date)) setStartDate(date);
    }
  }, []);

  // Calculate current day or countdown
  useEffect(() => {
    if (!startDate) return;
    const today = new Date();
    const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (diff <= 0) {
      setDaysUntilStart(Math.abs(diff) + 1); // before start
      setCurrentDay(null);
    } else {
      setDaysUntilStart(null);
      setCurrentDay(diff <= totalDays ? diff : totalDays);
    }
  }, [startDate]);

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;
    localStorage.setItem("arcStartDate", newDate);
    setStartDate(new Date(newDate));
  };

  // Reset date
  const resetDate = () => {
    localStorage.removeItem("arcStartDate");
    setStartDate(null);
    setCurrentDay(null);
    setDaysUntilStart(null);
  };

  // Common styles
  const boxClasses = `
    flex flex-col items-center text-center bg-[#1e293b]/90 
     rounded-lg text-white
    ${isMobile ? "w-full py-3 mt-3" : "py-2 px-3 ml-4"}
  `;

  // If no start date yet → show date picker
  if (!startDate) {
    return (
      <div className={`${boxClasses}`}>
        <span className="text-xs font-semibold text-orange-400 uppercase mb-2">
          Set Start Date
        </span>
        <input
          type="date"
          onChange={handleDateChange}
          className="bg-[#0f172a] text-white border border-gray-600 rounded px-2 py-1 text-sm cursor-pointer"
        />
      </div>
    );
  }

  // If program hasn’t started yet → countdown
  if (daysUntilStart !== null) {
    return (
      <div className={`${boxClasses}`}>
        <span className="text-xs font-semibold text-orange-400 uppercase">
          Winter ARC
        </span>
        <span className="text-sm font-bold text-white">
          Starts in {daysUntilStart} day{daysUntilStart > 1 ? "s" : ""}
        </span>
        <span className="text-xs text-gray-300">Get Ready!</span>
        <button
          onClick={resetDate}
          className="text-[10px] text-gray-400 mt-1 underline hover:text-orange-400"
        >
          Reset Date
        </button>
      </div>
    );
  }

  // Normal tracker (active days)
  return (
    <div className={`${boxClasses}`}>
      <span className="text-xs font-semibold text-orange-400 uppercase">
        Winter ARC
      </span>
      <span className="text-sm font-bold text-white">
        Day {currentDay} / {totalDays}
      </span>
      <span className="text-xs text-gray-300">Stay Consistent</span>
      <button
        onClick={resetDate}
        className="text-[10px] text-gray-400 mt-1 underline hover:text-orange-400"
      >
        Reset Date
      </button>
    </div>
  );
}

// -----------------------------
// Navbar Component
// -----------------------------
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Schedule", href: "/schedule" },
    { label: "Roles", href: "/roles" },
    { label: "Tracker", href: "/tracker" },
    { label: "Analytics", href: "/analytics" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#1e293b]/60 shadow-lg shadow-[#0f172a]/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-orange-400 tracking-wide hover:text-orange-300 transition"
        >
          Winter ARC ❄️
        </Link>

        {/* Desktop Links + Tracker */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-orange-400 transition duration-300"
            >
              {link.label}
            </Link>
          ))}
          <CurrentDayTracker />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-orange-400 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#1e293b]/90 border-t border-[#334155] backdrop-blur-md px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-orange-400 transition duration-300"
            >
              {link.label}
            </Link>
          ))}
          <CurrentDayTracker isMobile />
        </div>
      )}
    </nav>
  );
}
