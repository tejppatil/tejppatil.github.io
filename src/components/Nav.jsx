import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-bg/80 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan to-purple"
        style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <img
            src={logo}
            alt="Dreamwalker4u logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full transition group-hover:scale-105"
          />
          <span className="font-mono text-xs tracking-widest text-dim group-hover:text-cyan transition hidden sm:inline">
            DREAMWALKER4U
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={`px-3 py-2 rounded-md transition-colors relative ${active === s.id ? "text-cyan" : "text-dim hover:text-ink"
                }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 bg-cyan/10 rounded-md border border-cyan/30"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </nav>

        <a
          href="/Tejas-Patil-Resume.pdf"
          download="Tejas-Patil-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-md border border-cyan/40 text-cyan hover:bg-cyan/10 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Resume
        </a>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-bg/95 backdrop-blur-md border-b border-line px-5 pb-4 flex flex-col gap-1 font-mono text-sm"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={`text-left py-2 ${active === s.id ? "text-cyan" : "text-dim"
                }`}
            >
              {s.label}
            </button>
          ))}
          <a
            href="/Tejas-Patil-Resume.pdf"
            download="Tejas-Patil-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-cyan"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-4 h-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Resume
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
