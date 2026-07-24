import { Reveal, SectionLabel } from "./Reveal";
import { achievements } from "../data";
import { Trophy, Award, ExternalLink } from "lucide-react";

export default function Achievements() {
  const featured = achievements.find((a) => a.featured);
  const rest = achievements.filter((a) => !a.featured);

  return (
    <section id="achievements" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="04" title="Achievements" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            Flags <span className="text-gradient">captured.</span>
          </h2>
        </Reveal>

        {featured && (
          <Reveal delay={0.1}>
            <div className="relative border border-cyan/30 rounded-2xl p-7 md:p-10 mb-6 overflow-hidden bg-bg-card/50">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "radial-gradient(600px circle at 15% 20%, rgba(62,201,255,0.25), transparent 60%)",
                }}
              />
              <div className="relative flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center glow-cyan">
                  <Trophy size={26} className="text-bg" />
                </div>
                <div>
                  <p className="font-mono text-xs text-cyan tracking-widest mb-2">
                    {featured.year} · #1 RANK
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2">
                    {featured.link ? (
                      <a
                        href={featured.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 hover:text-cyan transition-colors group"
                      >
                        {featured.title}
                        <ExternalLink size={20} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    ) : (
                      featured.title
                    )}
                  </h3>
                  <p className="text-purple font-medium mb-3">{featured.org}</p>
                  <p className="text-dim leading-relaxed max-w-2xl">
                    {featured.detail}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {rest.map((a, i) => (
            <Reveal key={a.title} delay={0.1 + i * 0.06}>
              <div className="h-full border border-line rounded-xl p-6 bg-bg-card/30 hover:border-purple/40 transition-colors">
                <div className="flex items-center gap-2.5 mb-3 text-purple">
                  <Award size={17} />
                  <span className="font-mono text-[11px] text-dim">
                    {a.year}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-ink mb-1">
                  {a.title}
                </h4>
                <p className="text-xs text-dim mb-2 font-mono">{a.org}</p>
                <p className="text-sm text-dim leading-relaxed">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
