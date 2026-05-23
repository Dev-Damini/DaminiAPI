import { Bot, Image as ImageIcon, Mail, ChevronRight } from 'lucide-react';
import type { SectionType } from '@/types';

interface NavItem {
  id: SectionType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeBorder: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'ai-chat',
    label: 'AI Text Engine',
    sublabel: 'Chat & Completion',
    icon: Bot,
    color: 'text-violet-400',
    activeBg: 'bg-violet-500/10',
    activeBorder: 'border-violet-500/30',
  },
  {
    id: 'ai-image',
    label: 'AI Image Engine',
    sublabel: 'Text-to-Image',
    icon: ImageIcon,
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-500/10',
    activeBorder: 'border-cyan-500/30',
  },
  {
    id: 'tempmail',
    label: 'Temp Mail',
    sublabel: 'Disposable Inbox',
    icon: Mail,
    color: 'text-amber-400',
    activeBg: 'bg-amber-500/10',
    activeBorder: 'border-amber-500/30',
  },
];

interface Props {
  active: SectionType;
  onChange: (section: SectionType) => void;
}

export default function Sidebar({ active, onChange }: Props) {
  return (
    <nav className="space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-3">
        API Modules
      </p>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left group ${
              isActive
                ? `${item.activeBg} ${item.activeBorder}`
                : 'border-transparent hover:bg-white/5 hover:border-border'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isActive ? `${item.activeBg} border border-current/20` : 'bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-muted-foreground group-hover:text-foreground/70'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${isActive ? 'text-foreground' : 'text-foreground/60 group-hover:text-foreground/80'}`}>
                {item.label}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{item.sublabel}</p>
            </div>
            {isActive && (
              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${item.color}`} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
