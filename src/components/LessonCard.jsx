import { Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { useProgress } from '../context/ProgressContext.jsx';

const levelColor = {
  เริ่มต้น: 'bg-green-100 text-green-700',
  กลาง: 'bg-amber-100 text-amber-700',
  สรุป: 'bg-purple-100 text-purple-700',
};

export default function LessonCard({ lesson, index }) {
  const { isComplete } = useProgress();
  const done = isComplete(lesson.slug);

  return (
    <Link
      to={`/lesson/${lesson.slug}`}
      className="group relative flex flex-col p-5 bg-white border border-slate-200 rounded-xl hover:border-brand-400 hover:shadow-md transition-all"
    >
      {done && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-slate-400 w-7">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColor[lesson.level] ?? 'bg-slate-100 text-slate-700'}`}>
          {lesson.level}
        </span>
      </div>

      <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-700 transition-colors mb-2">
        {lesson.title}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
        {lesson.description}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            บทเรียน
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}