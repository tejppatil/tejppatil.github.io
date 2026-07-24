import { Reveal, SectionLabel } from "./Reveal";
import { leadership } from "../data";
import { Crown } from "lucide-react";

export default function Leadership() {
  return (
    <section id="leadership" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="07" title="Leadership" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            Leading from the{" "}
            <span className="text-gradient">front line.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {leadership.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group relative border border-line rounded-xl p-6 bg-bg-card/50 hover:border-cyan/40 transition-colors duration-300 overflow-hidden">
                {/* Glow accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative flex gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/15 to-purple/15 border border-line flex items-center justify-center text-cyan group-hover:border-cyan/40 transition-colors">
                    <Crown size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-ink leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-dim text-sm mt-1">{item.org}</p>
                    <p className="font-mono text-xs text-cyan/80 mt-2">
                      {item.period}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
