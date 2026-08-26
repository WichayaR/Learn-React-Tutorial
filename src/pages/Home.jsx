import { Link } from 'react-router-dom';
import { Sparkles, Code2, Layers, Zap, ArrowRight } from 'lucide-react';
import LessonCard from '../components/LessonCard.jsx';
import { lessons } from '../content/index.js';
import { useProgress } from '../context/ProgressContext.jsx';

export default function Home() {
  const { completed } = useProgress();
  const firstLesson = lessons[0];
  const progressPct = Math.round((completed.length / lessons.length) * 100);

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-purple-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700 uppercase tracking-wider">
              React Tutorial TH
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-4">
            เรียน React <br />
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              ตั้งแต่พื้นฐานจนใช้ได้จริง
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed">
            บทเรียนภาษาไทย 11 บท ครอบคลุม{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-brand-700">useState</code>,{' '}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-brand-700">useEffect</code>,{' '}
            Props, Context API และ React Router พร้อม{' '}
            <strong>live code editor</strong> ให้ลองเล่นได้ทันที
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/lesson/${firstLesson.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition"
            >
              เริ่มเรียนเลย
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 transition"
            >
              เกี่ยวกับเว็บนี้
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl">
            <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-lg p-4">
              <Code2 className="w-5 h-5 text-brand-600 mb-2" />
              <div className="font-bold text-2xl text-slate-900">11</div>
              <div className="text-xs text-slate-500">บทเรียน</div>
            </div>
            <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-lg p-4">
              <Layers className="w-5 h-5 text-brand-600 mb-2" />
              <div className="font-bold text-2xl text-slate-900">5+</div>
              <div className="text-xs text-slate-500">React Hooks</div>
            </div>
            <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-lg p-4">
              <Zap className="w-5 h-5 text-brand-600 mb-2" />
              <div className="font-bold text-2xl text-slate-900">11</div>
              <div className="text-xs text-slate-500">Live demos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">สารบัญบทเรียน</h2>
            <p className="text-slate-600">
              เรียนตามลำดับ หรือข้ามไปอ่านหัวข้อที่สนใจก็ได้
            </p>
          </div>
          {completed.length > 0 && (
            <div className="text-sm">
              <span className="text-slate-500">ความคืบหน้า:</span>{' '}
              <span className="font-semibold text-brand-700">
                {completed.length}/{lessons.length} ({progressPct}%)
              </span>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, idx) => (
            <LessonCard key={lesson.slug} lesson={lesson} index={idx} />
          ))}
        </div>
      </section>

      {/* Footer note */}
      <section className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
        <p>
          💡 เนื้อหาอ้างอิงจาก{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            React Docs
          </a>{' '}
          สรุปบทเรียน REACT • สร้างจาก AI เพื่อการศึกษา โดย <a
            href="https://github.com/WichayaR"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          > WichayaR</a>
        </p>
      </section>
    </div>
  );
}