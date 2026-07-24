import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Reveal, SectionLabel } from "./Reveal";
import { profile } from "../data";
import { Mail, Phone, Send, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";

// ---------------------------------------------------------------------------
// EmailJS setup (free, no backend required):
//   1. Create an account at https://www.emailjs.com
//   2. Add an Email Service (connect your Gmail: tppatil397@gmail.com)
//      -> copy the "Service ID"
//   3. Create an Email Template with these variables in the body:
//        {{from_name}}  {{from_email}}  {{message}}  {{subject}}
//      -> copy the "Template ID"
//   4. Account -> General -> copy your "Public Key"
//   5. Paste all three below. That's it — messages submitted on the site
//      will land directly in tppatil397@gmail.com.
// ---------------------------------------------------------------------------
const EMAILJS_SERVICE_ID = "service_jmv0q4l";
const EMAILJS_TEMPLATE_ID = "template_3f3ys17";
const EMAILJS_PUBLIC_KEY = "9bn4VVONLCv16T_fU";

const EMAIL_SUBJECT = "Message received from the Portfolio website";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check — bots fill this field, humans don't see it
    if (form.website) {
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          subject: EMAIL_SUBJECT,
          to_email: profile.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionLabel index="08" title="Contact" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Let's <span className="text-gradient">connect.</span>
          </h2>
          <p className="text-dim max-w-xl mb-14">
            Open to internships, CTF collaborations, and security research
            conversations. Reach out directly or drop a message below.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16">
          <Reveal className="md:col-span-2" delay={0.1}>
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-cyan/40 transition-colors group"
              >
                <span className="w-10 h-10 rounded-lg border border-cyan/30 flex items-center justify-center text-cyan shrink-0">
                  <Mail size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-dim">Email</p>
                  <p className="text-sm text-ink truncate group-hover:text-cyan transition">
                    {profile.email}
                  </p>
                </div>
              </a>

              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({
                    ...f,
                    message: f.message || "Hi Tejas, I would like to request your phone number / set up a call regarding: ",
                  }));
                  document.querySelector('textarea[name="message"]')?.focus();
                }}
                className="w-full text-left flex items-center gap-3 border border-line rounded-lg p-4 hover:border-purple/40 transition-colors group cursor-pointer"
              >
                <span className="w-10 h-10 rounded-lg border border-purple/30 flex items-center justify-center text-purple shrink-0">
                  <Phone size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-dim">Phone</p>
                  <p className="text-sm text-ink group-hover:text-purple transition">
                    Request contact info
                  </p>
                </div>
              </button>

              <div className="flex gap-3 pt-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-line rounded-lg py-3 text-dim hover:text-cyan hover:border-cyan/40 transition-colors font-mono text-xs"
                >
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-line rounded-lg py-3 text-dim hover:text-purple hover:border-purple/40 transition-colors font-mono text-xs"
                >
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-3" delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Visually hidden honeypot input field to catch spam bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] opacity-0 pointer-events-none">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[11px] text-dim block mb-2">
                    name
                  </label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-bg-card/40 border border-line rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-cyan/60 transition-colors"
                    placeholder="Jon Snow"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-dim block mb-2">
                    email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-bg-card/40 border border-line rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-cyan/60 transition-colors"
                    placeholder="jon.snow@gameofthrones.com"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[11px] text-dim block mb-2">
                  message
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-bg-card/40 border border-line rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-cyan/60 transition-colors resize-none"
                  placeholder="Let's talk about..."
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan to-purple text-bg font-mono text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {status === "sent" ? (
                    <>
                      <Check size={16} /> Sent
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {status === "sending" ? "Sending..." : "Send Message"}
                    </>
                  )}
                </button>
                {status === "sent" && (
                  <p className="font-mono text-xs text-cyan animate-fade-in">
                    Thanks — I'll get back to you within a few days.
                  </p>
                )}
              </div>
              {status === "error" && (
                <p className="text-xs text-red-400 font-mono">
                  Something went wrong — email {profile.email} directly.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
