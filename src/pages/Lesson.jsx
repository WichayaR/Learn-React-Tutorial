import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import CodeBlock from '../components/CodeBlock.jsx';
import LiveCode from '../components/LiveCode.jsx';
import Callout from '../components/Callout.jsx';
import PrevNext from '../components/PrevNext.jsx';
import {
  getLessonBySlug,
  getAdjacentLessons,
  loadLessonMarkdown,
  lessons,
} from '../content/index.js';
import { useProgress } from '../context/ProgressContext.jsx';

// แมป component พิเศษสำหรับ markdown
const components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1] ?? 'text';
    if (inline) {
      return (
        <code className="bg-slate-100 text-brand-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    if (lang === 'live') {
      try {
        const parsed = JSON.parse(String(children).replace(/\n$/, ''));
        return <LiveCode files={parsed.files} options={parsed.options} />;
      } catch (e) {
        return (
          <Callout type="warn" title="Live code error">
            ไม่สามารถ parse live code block ได้: {String(e)}
          </Callout>
        );
      }
    }
    return (
      <CodeBlock language={lang}>{String(children).replace(/\n$/, '')}</CodeBlock>
    );
  },
};

export default function Lesson() {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const { prev, next } = getAdjacentLessons(slug);
  const { isComplete, markComplete, markIncomplete } = useProgress();
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMarkdown(null);
    setLoading(true);
    setNotFound(false);

    if (!lesson) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    loadLessonMarkdown(slug).then((content) => {
      if (cancelled) return;
      if (!content) {
        setNotFound(true);
      } else {
        setMarkdown(content);
        // scroll to top when lesson changes
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, lesson]);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ไม่พบบทเรียนนี้</h1>
        <p className="text-slate-600 mb-6">
          บทเรียน <code>{slug}</code> อาจยังไม่ได้เขียน หรือถูกลบไปแล้ว
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const done = isComplete(slug);

  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          หน้าแรก
        </Link>

        {/* Header */}
        <header className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="font-mono">
                  บทที่ {lessons.indexOf(lesson) + 1}
                </span>
                <span>•</span>
                <span>{lesson.duration}</span>
                <span>•</span>
                <span>{lesson.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {lesson.title}
              </h1>
              <p className="mt-2 text-slate-600 text-lg">{lesson.description}</p>
            </div>
            <button
              onClick={() => (done ? markIncomplete(slug) : markComplete(slug))}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition shrink-0 ${
                done
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {done ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  อ่านแล้ว
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  ทำเครื่องหมายว่าอ่านแล้ว
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-slate-500">กำลังโหลดบทเรียน...</p>
          </div>
        ) : (
          <div className="prose-lesson">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}

        {/* Prev/Next */}
        {!loading && <PrevNext prev={prev} next={next} />}
      </div>
    </article>
  );
}