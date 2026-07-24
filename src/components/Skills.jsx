import { Reveal, SectionLabel } from "./Reveal";
import { skills } from "../data";
import { motion } from "framer-motion";
import {
  NmapIcon,
  MetasploitIcon,
  BurpsuiteIcon,
  NiktoIcon,
  GobusterIcon,
  Enum4linuxIcon,
} from "./icons";

const customIcons = {
  NmapIcon,
  MetasploitIcon,
  BurpsuiteIcon,
  NiktoIcon,
  GobusterIcon,
  Enum4linuxIcon,
};

function SkillTile({ skill, index }) {
  const isObject = typeof skill === "object";
  const name = isObject ? skill.name : skill;
  const icon = isObject ? skill.icon : null;
  const customIconName = isObject ? skill.customIcon : null;
  const CustomIcon = customIconName ? customIcons[customIconName] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="group px-3.5 py-2 rounded-lg border border-line text-sm text-ink hover:border-cyan/50 hover:text-cyan transition-all duration-300 bg-bg-card/30 flex items-center gap-2.5 cursor-default"
    >
      {icon && (
        <svg
          role="img"
          viewBox="0 0 24 24"
          className="w-5 h-5 shrink-0 fill-current text-cyan group-hover:text-purple transition-colors duration-300"
        >
          <path d={icon.path} />
        </svg>
      )}
      {CustomIcon && (
        <CustomIcon className="w-5 h-5 shrink-0 text-cyan group-hover:text-purple transition-colors duration-300" />
      )}
      <span className="font-mono text-xs font-semibold">{name}</span>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="06" title="Skills" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-14">
            The <span className="text-gradient">toolkit.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {Object.entries(skills).map(([group, items], gi) => (
            <Reveal key={group} delay={gi * 0.1}>
              <p className="font-mono text-xs text-purple tracking-widest mb-5">
                &gt; {group.toLowerCase().replace(/\s+/g, "_")}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill, i) => (
                  <SkillTile
                    key={typeof skill === "object" ? skill.name : skill}
                    skill={skill}
                    index={i}
                  />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

