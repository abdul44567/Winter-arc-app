export default function Footer() {
  return (
    <footer className="relative py-8 text-center border-t border-gray-800 bg-[#0f172a]/80 backdrop-blur-md">
      {/* Decorative glowing circle */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />
      </div>

      <p className="text-gray-400 text-sm tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="text-orange-400 font-medium">Winter ARC</span> — Built
        with ❄️ & Discipline.
      </p>

      <p className="text-[12px] mt-2 text-gray-500">
        Designed for the <span className="text-cyan-400">90 Day Challenge</span>
      </p>
    </footer>
  );
}
