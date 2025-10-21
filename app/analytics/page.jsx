"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AnalyticsSection() {
  const totalDays = 90;
  const [mounted, setMounted] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);

  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem("completedDays") || "[]");

    setCompletedDays(saved);
  }, []);

  if (!mounted) return null;

  const totalCompleted = completedDays.length;
  const longestStreak = completedDays.reduce(
    (acc, curr, idx) => {
      if (completedDays.includes(idx + 1)) {
        acc.current++;
        if (acc.current > acc.max) acc.max = acc.current;
      } else {
        acc.current = 0;
      }
      return acc;
    },
    { current: 0, max: 0 }
  ).max;

  const completionPercent = Math.round((totalCompleted / totalDays) * 100);

  const weeks = Array.from(
    { length: Math.ceil(totalDays / 7) },
    (_, i) => i + 1
  );
  const weeklyData = weeks.map(
    (week, i) =>
      completedDays.filter((d) => d > i * 7 && d <= (i + 1) * 7).length
  );

  const chartData = {
    labels: weeks.map((w) => `Week ${w}`),
    datasets: [
      {
        label: "Days Completed",
        data: weeklyData,
        fill: false,
        borderColor: "#f97316",
        backgroundColor: "#f97316",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: 7,
        ticks: { stepSize: 1, color: "#ffffff" },
      },
      x: { ticks: { color: "#ffffff" } },
    },
  };

  const suggestions = [
    "Try to fill in missed days consistently to build habit.",
    "Your first two weeks are strong, keep going!",
    "Mid-cycle dips are common; stay motivated!",
  ];

  return (
    <section className="bg-[#0f172a] text-white py-30 px-6 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-8 text-center">
        Analytics & Insights
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
        <div className="bg-[#1e293b]/60 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Total Days Completed
          </h3>
          <p className="text-2xl font-bold text-white">{totalCompleted}</p>
        </div>
        <div className="bg-[#1e293b]/60 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Longest Streak
          </h3>
          <p className="text-2xl font-bold text-white">{longestStreak} days</p>
        </div>
        <div className="bg-[#1e293b]/60 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            % Completion
          </h3>
          <p className="text-2xl font-bold text-white">{completionPercent}%</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-[#1e293b]/60 rounded-xl p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">
          Weekly Progress
        </h3>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Suggestions */}
      <div className="bg-[#1e293b]/60 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">
          Trends & Suggestions
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
