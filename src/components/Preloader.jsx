import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

const LINES = [
  { text: "> whoami", delay: 150 },
  { text: "tejas.patil // cybersecurity", delay: 100, dim: true },
  { text: "> mounting_render_engine.wasm", delay: 350 },
  { text: "> loading_profile.sh --verbose", delay: 450 },
  { text: "[####################] 100%", delay: 100, dim: true },
  { text: "> access granted", delay: 400, accent: true },
];

export default function Preloader({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (lineIndex < LINES.length) {
      const t = setTimeout(() => {
        setLineIndex((i) => i + 1);
      }, LINES[lineIndex].delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setExiting(true), 400);
      return () => clearTimeout(t);
    }
  }, [lineIndex]);

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [exiting, onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center px-6"
        >
          <motion.img
            src={logo}
            alt=""
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20 mb-8 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              boxShadow: "0 0 30px rgba(62,201,255,0.35)",
            }}
          />
          <div className="w-full max-w-md font-mono text-sm md:text-base space-y-2 min-h-[140px]">
            {LINES.slice(0, lineIndex).map((line, i) => (
              <div
                key={i}
                className={
                  line.accent
                    ? "text-gradient font-semibold"
                    : line.dim
                    ? "text-dim/70"
                    : "text-ink"
                }
              >
                {line.text}
                {i === lineIndex - 1 && (
                  <span className="cursor-blink text-cyan">_</span>
                )}
              </div>
            ))}
          </div>
          <motion.div
            className="mt-10 h-[2px] w-64 md:w-80 bg-line overflow-hidden rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan to-purple"
              initial={{ width: "0%" }}
              animate={{ width: `${(lineIndex / LINES.length) * 100}%` }}
              transition={{ ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
