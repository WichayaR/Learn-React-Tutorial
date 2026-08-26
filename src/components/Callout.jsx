import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

const variants = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    icon: Info,
    iconColor: 'text-blue-600',
  },
  tip: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    icon: Lightbulb,
    iconColor: 'text-amber-600',
  },
  warn: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-900',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
};

export default function Callout({ type = 'info', title, children }) {
  const v = variants[type] ?? variants.info;
  const Icon = v.icon;
  return (
    <div className={`my-4 ${v.bg} ${v.border} ${v.text} border-l-4 rounded-r-lg p-4 flex gap-3`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${v.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}