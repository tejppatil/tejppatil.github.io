import { motion } from "framer-motion";
import { Reveal, SectionLabel } from "./Reveal";
import { projects } from "../data";
import { ArrowUpRight, FolderGit2 } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="03" title="Projects" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            Things I've <span className="text-gradient">built.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.a
                href={p.link || undefined}
                target={p.link ? "_blank" : undefined}
                rel={p.link ? "noreferrer" : undefined}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`group block h-full border border-line rounded-xl p-6 md:p-7 bg-bg-card/40 hover:border-cyan/40 transition-colors relative overflow-hidden ${
                  p.link ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className="absolute -top-20 -right-20 w-52 h-52 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(155,91,255,0.25), transparent 70%)",
                  }}
                />
                <div className="relative flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg border border-cyan/30 flex items-center justify-center text-cyan">
                    <FolderGit2 size={18} />
                  </div>
                  {p.link && (
                    <ArrowUpRight
                      size={18}
                      className="text-dim group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  )}
                </div>

                <h3 className="relative font-display text-xl font-semibold text-ink mb-1">
                  {p.name}
                </h3>
                <p className="relative font-mono text-xs text-purple mb-3">
                  {p.tagline}
                </p>
                <p className="relative text-sm text-dim leading-relaxed mb-5">
                  {p.description}
                </p>
                <div className="relative flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full border border-line text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
