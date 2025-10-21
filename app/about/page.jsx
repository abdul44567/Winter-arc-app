"use client";
import { Target, Flame, Clock, Mountain } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const values = [
    {
      icon: <Flame size={30} className="text-orange-400" />,
      title: "Discipline",
      text: "We believe that consistency and self-control are the foundation of true success.",
    },
    {
      icon: <Target size={30} className="text-orange-400" />,
      title: "Focus",
      text: "In a world full of noise, we aim to sharpen your attention toward what truly matters.",
    },
    {
      icon: <Mountain size={30} className="text-orange-400" />,
      title: "Growth",
      text: "Every day is an opportunity to learn, evolve, and become stronger  mentally and physically.",
    },
    {
      icon: <Clock size={30} className="text-orange-400" />,
      title: "Consistency",
      text: "Small, steady efforts compound into massive change over time.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-30">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-orange-400 mb-3">
          About Winter ARC
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Winter ARC is a 90-day journey built to challenge your comfort zone, strengthen your habits, and help you become the most disciplined version of yourself.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h2 className="text-2xl font-semibold text-orange-400 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-300 leading-relaxed">
          To build a global community of individuals who embrace discomfort, commit to daily growth, and push their limits  physically, mentally, and spiritually.
        </p>
      </motion.div>

      {/* Core Values Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="bg-[#1e293b]/60 border border-gray-700 hover:border-orange-400 rounded-xl p-6 text-center backdrop-blur-md transition-all duration-300 hover:scale-[1.03]"
          >
            <div className="flex justify-center mb-3">{val.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {val.title}
            </h3>
            <p className="text-sm text-gray-300">{val.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Founder / Inspiration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-3xl mx-auto text-center mt-20"
      >
        <h2 className="text-2xl font-semibold text-orange-400 mb-3">
          The Inspiration Behind ARC
        </h2>
        <p className="text-gray-400">
          “ARC” stands for **Accountability, Resilience, and Consistency**  the pillars of lasting transformation.
          This movement was created to help people turn winter, a season of stillness, into a time of personal strength.
        </p>
      </motion.div>

      {/* Quote */}
      <p className="text-center text-gray-400 mt-16 italic">
        “This winter, don’t just survive — evolve.” ❄️
      </p>
    </section>
  );
}
