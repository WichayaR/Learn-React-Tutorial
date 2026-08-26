import { Link } from 'react-router-dom';
import { BookOpen, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-slate-900 text-lg">Learn React</span>
            <span className="text-xs text-slate-500">เรียน React ฉบับสมบูรณ์</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
          >
            หน้าแรก
          </Link>
          <Link
            to="/about"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
          >
            เกี่ยวกับ
          </Link>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
          >
            <Github className="w-4 h-4" />
            React Docs
          </a>
        </nav>
      </div>
    </header>
  );
}