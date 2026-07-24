import { motion } from "framer-motion";

export function Reveal({ children, className = "", delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-xs text-cyan tracking-widest">
        {index}
      </span>
      <span className="h-px flex-1 max-w-10 bg-gradient-to-r from-cyan to-purple opacity-50" />
      <span className="font-mono text-xs text-dim tracking-widest uppercase">
        {title}
      </span>
    </div>
  );
}
