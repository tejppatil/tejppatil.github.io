import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { profile } from "../data";
import ErrorBoundary from "./ErrorBoundary";

const HeroCore = lazy(() => import("./HeroCore"));

const nameParts = profile.name.split(" ");

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const letter = {
  hidden: { y: 60, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-5 md:px-8 pt-24 pb-16"
    >
      <ErrorBoundary>
        <Suspense fallback={null}>
          <HeroCore />
        </Suspense>
      </ErrorBoundary>

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-mono text-xs md:text-sm text-cyan tracking-widest mb-6"
        >
          <span className="text-dim">$</span> cat profile.json{" "}
          <span className="cursor-blink">_</span>
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-extrabold text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight overflow-hidden"
        >
          {nameParts.map((word, wi) => (
            <span key={wi} className="block">
              {word.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  variants={letter}
                  className={
                    wi === nameParts.length - 1
                      ? "inline-block text-gradient"
                      : "inline-block text-ink"
                  }
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 max-w-xl font-mono text-sm md:text-base text-dim"
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="mt-3 font-display text-xl md:text-2xl font-semibold text-gradient"
        >
          {profile.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={profile.resume}
            download="Tejas-Patil-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-cyan to-purple text-bg font-mono text-sm font-semibold hover:opacity-90 transition"
          >
            <Download size={16} /> Download Resume
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-line text-dim hover:text-cyan hover:border-cyan/50 transition"
            aria-label="GitHub"
          >
            <GithubIcon className="w-[18px] h-[18px]" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-line text-dim hover:text-purple hover:border-purple/50 transition"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-[18px] h-[18px]" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim"
      >
        <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
