import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PrevNext({ prev, next }) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-12 pt-6 border-t border-slate-200 flex items-stretch justify-between gap-3">
      {prev ? (
        <Link
          to={`/lesson/${prev.slug}`}
          className="flex-1 group flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-brand-600" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">ก่อนหน้า</div>
            <div className="font-semibold text-slate-900 group-hover:text-brand-700 truncate">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={`/lesson/${next.slug}`}
          className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-lg border border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition text-right"
        >
          <div className="min-w-0">
            <div className="text-xs text-slate-500">ถัดไป</div>
            <div className="font-semibold text-slate-900 group-hover:text-brand-700 truncate">
              {next.title}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}