import logo from "../assets/logo.png";
import { profile } from "../data";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 md:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt={profile.name}
            width={24}
            height={24}
            loading="lazy"
            className="w-6 h-6 rounded-full"
          />
          <span className="font-mono text-xs text-dim">
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <p className="font-mono text-xs text-dim/70">
          Think. Analyze. Secure. Create.
        </p>
      </div>
    </footer>
  );
}
