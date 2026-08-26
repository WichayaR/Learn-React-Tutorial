import { NavLink } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { lessons } from '../content/index.js';
import { useProgress } from '../context/ProgressContext.jsx';

export default function Sidebar() {
  const { completed } = useProgress();
  const progressPct = Math.round((completed.length / lessons.length) * 100);

  return (
    <aside className="hidden lg:flex w-72 shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] flex-col">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900">สารบัญบทเรียน</h2>
          <span className="text-xs font-mono text-slate-500">
            {completed.length}/{lessons.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          ความคืบหน้า {progressPct}%
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const isDone = completed.includes(lesson.slug);
            return (
              <li key={lesson.slug}>
                <NavLink
                  to={`/lesson/${lesson.slug}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                  </span>
                  <span className="font-mono text-xs text-slate-400 w-5 shrink-0">
                    {String(lessons.indexOf(lesson) + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
        💾 ความคืบหน้าถูกบันทึกในเบราว์เซอร์ของคุณ
      </div>
    </aside>
  );
}