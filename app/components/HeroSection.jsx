"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Decorative Glow Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full" />

      {/* Hero Content */}
      <motion.h1
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
      >
        Embrace the <span className="text-orange-400">Winter ARC</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-gray-300 text-lg max-w-md md:max-w-2xl mb-10 leading-relaxed"
      >
        90 days of <span className="text-orange-400 font-medium">discipline</span>, clarity, and focus.  
        Build the <span className="text-cyan-400 font-medium">strongest version</span> of yourself this winter ❄️
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          href="/tracker"
          className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
        >
          Start Your Journey →
        </Link>
      </motion.div>

      {/* Subtle bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  );
}
