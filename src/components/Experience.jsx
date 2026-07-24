import { Reveal, SectionLabel } from "./Reveal";
import { experience } from "../data";
import { Terminal } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="02" title="Experience" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            Field <span className="text-gradient">deployments.</span>
          </h2>
        </Reveal>

        <div className="relative pl-8 md:pl-10">
          <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan via-purple to-transparent" />

          <div className="space-y-14">
            {experience.map((job, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative">
                  <span className="absolute -left-8 md:-left-10 top-1 w-4 h-4 rounded-full bg-bg border-2 border-cyan flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                  </span>

                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {job.role}
                    </h3>
                    <span className="font-mono text-xs text-cyan">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-dim font-medium mb-4">{job.org}</p>

                  <div className="border border-line rounded-lg bg-bg-card/40 p-5">
                    <div className="flex items-center gap-2 mb-3 text-dim/70">
                      <Terminal size={13} />
                      <span className="font-mono text-[11px] tracking-wide">
                        output --log
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {job.points.map((pt, j) => (
                        <li
                          key={j}
                          className="flex gap-2.5 text-sm md:text-base text-dim leading-relaxed"
                        >
                          <span className="text-purple font-mono mt-0.5 shrink-0">
                            ▸
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
