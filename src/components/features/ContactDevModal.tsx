import { useState } from 'react';
import { X, MessageCircle, Mail, Globe, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import contactAnime from '@/assets/contact-anime.png';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ContactDevModal({ open, onClose }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!open) return null;

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-sm overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #000',
          borderRadius: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black" style={{ background: '#000' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">DEV_CONTACT.json</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar section */}
        <div className="flex border-b border-black">
          {/* Left — avatar */}
          <div className="w-36 border-r border-black flex-shrink-0 flex flex-col items-center justify-end overflow-hidden" style={{ background: '#f7f7f7', minHeight: 180 }}>
            <img
              src={contactAnime}
              alt="Dev Daminī"
              className="w-full object-cover object-top"
              style={{ maxHeight: 180 }}
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
              }}
            />
          </div>

          {/* Right — identity */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">DEVELOPER</p>
              <h2 className="text-lg font-bold font-mono leading-tight" style={{ color: '#000' }}>Dev Daminī</h2>
              <p className="text-xs font-mono mt-1" style={{ color: '#6b7280' }}>Full-Stack Software Developer</p>
              <div className="mt-2 border border-black px-2 py-1 inline-block">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: '#000' }}>DAMINI CODESPHERE</span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-mono text-gray-500">online · probably not</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-3 border-b border-black" style={{ background: '#f9f9f9' }}>
          <p className="text-xs font-mono leading-relaxed" style={{ color: '#374151' }}>
            <span className="text-gray-400 select-none">// </span>
            Mendokusei. Send the payload or don't—I'm probably asleep anyway
          </p>
        </div>

        {/* Contact rows */}
        <div className="divide-y divide-black border-b border-black">
          {[
            { id: 'whatsapp', label: 'WHATSAPP', value: '+2349120185747', href: 'https://wa.me/2349120185747', Icon: MessageCircle },
            { id: 'email', label: 'EMAIL', value: 'damibotzinc@gmail.com', href: 'mailto:damibotzinc@gmail.com', Icon: Mail },
          ].map(({ id, label, value, href, Icon }) => (
            <div key={id} className="flex items-center gap-0">
              <div className="w-8 h-12 border-r border-black flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5" style={{ color: '#000' }} />
              </div>
              <div className="flex-1 px-3 py-2 min-w-0">
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono font-semibold truncate block hover:underline" style={{ color: '#000' }}>
                  {value}
                </a>
              </div>
              <button onClick={() => copyText(value, id)}
                className="w-12 h-12 border-l border-black flex items-center justify-center transition-colors hover:bg-black hover:text-white flex-shrink-0">
                {copiedField === id
                  ? <CheckCheck className="w-3.5 h-3.5 text-green-600" />
                  : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>

        {/* Portfolio links */}
        <div className="divide-y divide-black border-b border-black">
          {[
            { label: 'PORTFOLIO', url: 'https://www.damini-dev.name.ng', desc: 'Founder profile' },
            { label: 'ORGANIZATION', url: 'https://daminicodes.zone.id', desc: 'Damini Codesphere' },
          ].map(({ label, url, desc }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center group transition-colors hover:bg-black hover:text-white"
              style={{ display: 'flex' }}>
              <div className="w-8 h-12 border-r border-black flex items-center justify-center flex-shrink-0 group-hover:border-white">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 px-3 py-2 min-w-0">
                <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300">{label}</p>
                <p className="text-xs font-mono truncate font-semibold">{desc}</p>
              </div>
              <div className="w-12 h-12 border-l border-black flex items-center justify-center flex-shrink-0 group-hover:border-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 divide-x divide-black">
          <a href="https://wa.me/2349120185747" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white border-none">
            <MessageCircle className="w-3.5 h-3.5" />WhatsApp
          </a>
          <a href="mailto:damibotzinc@gmail.com"
            className="flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white border-none" style={{ background: '#000', color: '#fff' }}>
            <Mail className="w-3.5 h-3.5" />Email
          </a>
        </div>
      </div>
    </div>
  );
}
