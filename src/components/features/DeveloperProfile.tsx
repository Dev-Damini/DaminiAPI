import devAvatar from '@/assets/dev-avatar.png';
import { MessageCircle, Globe, Code2, Zap } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/2349120185747';

export default function DeveloperProfile() {
  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col items-center gap-4 violet-glow-shadow">
      {/* Avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-violet-500/60 violet-glow-shadow">
          <img
            src={devAvatar}
            alt="Dev Daminī — Anime Developer Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">D</div>`;
              }
            }}
          />
        </div>
        {/* Pulsing active indicator */}
        <span
          className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#060814] pulse-active"
          aria-label="Online"
        />
      </div>

      {/* Identity */}
      <div className="text-center">
        <h2 className="text-base font-bold text-white tracking-wide">Dev Daminī</h2>
        <p className="text-xs text-violet-400 font-medium mt-0.5">Full-Stack Software Developer</p>
        <p className="text-xs text-muted-foreground mt-0.5">Damini Codesphere</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[
          { icon: Code2, label: 'TypeScript' },
          { icon: Zap, label: 'API Architect' },
          { icon: Globe, label: 'Cloud Native' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
          >
            <Icon className="w-2.5 h-2.5" />
            {label}
          </span>
        ))}
      </div>

      {/* Status row */}
      <div className="flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-active" />
        <span className="text-[11px] font-medium text-emerald-400">Active · Available for work</span>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp Contact
      </a>

      {/* Origin badge */}
      <div className="w-full text-center">
        <p className="text-[10px] text-muted-foreground font-mono break-all">
          {window.location.origin}
        </p>
      </div>
    </div>
  );
}
