import { Reveal, SectionLabel } from "./Reveal";
import { bio, education, profile } from "../data";
import { MapPin } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="01" title="About" />
        </Reveal>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16 mt-8">
          <Reveal className="md:col-span-3" delay={0.05}>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">
              Securing systems,{" "}
              <span className="text-gradient">one exploit at a time.</span>
            </h2>
            <p className="text-dim text-base md:text-lg leading-relaxed">
              {bio}
            </p>
            <div className="flex items-center gap-2 mt-6 font-mono text-sm text-dim">
              <MapPin size={15} className="text-cyan" />
              {profile.location}
            </div>
          </Reveal>

          <Reveal className="md:col-span-2" delay={0.15}>
            <div className="border border-line rounded-xl p-6 bg-bg-card/50">
              <p className="font-mono text-xs text-cyan tracking-widest mb-5">
                &gt; education.log
              </p>
              <div className="space-y-6">
                {education.map((e, i) => (
                  <div key={i} className="relative pl-5 border-l border-line">
                    <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-gradient-to-br from-cyan to-purple" />
                    <p className="font-display font-semibold text-ink">
                      {e.school}
                    </p>
                    <p className="text-sm text-dim mt-1">{e.degree}</p>
                    <p className="font-mono text-xs text-dim/70 mt-2">
                      {e.period} · {e.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
