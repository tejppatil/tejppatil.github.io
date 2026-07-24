import { Reveal, SectionLabel } from "./Reveal";
import { certifications } from "../data";
import { BadgeCheck, ExternalLink } from "lucide-react";

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="05" title="Certifications" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            Credentials <span className="text-gradient">on file.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {certifications.map((cert, i) => {
            const title = cert.title || cert;
            const link = cert.file;

            const content = (
              <>
                <div className="flex items-start gap-3 min-w-0">
                  <BadgeCheck
                    size={18}
                    className="text-cyan shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-ink leading-snug group-hover:text-cyan transition-colors">
                    {title}
                  </span>
                </div>
                {link && (
                  <ExternalLink
                    size={15}
                    className="text-dim opacity-40 group-hover:opacity-100 group-hover:text-cyan shrink-0 transition-all ml-2 mt-0.5"
                  />
                )}
              </>
            );

            return (
              <Reveal key={title} delay={(i % 6) * 0.05}>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 pointer-events-auto flex items-start justify-between border border-line rounded-lg p-4 bg-bg-card/30 hover:border-cyan/40 hover:bg-bg-card/60 transition-colors h-full group cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-start justify-between border border-line rounded-lg p-4 bg-bg-card/30 transition-colors h-full">
                    {content}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
