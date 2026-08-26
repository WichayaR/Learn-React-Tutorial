import { Link } from 'react-router-dom';
import { Heart, Code2, BookOpen, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          เกี่ยวกับเว็บนี้
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          เว็บสอน React ภาษาไทยสำหรับผู้เริ่มต้น เน้นการเรียนรู้ผ่านการลงมือทำจริง
          ด้วย live code editor ที่ฝังอยู่ในทุกบทเรียน
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="p-5 bg-brand-50 border border-brand-200 rounded-xl">
            <Code2 className="w-6 h-6 text-brand-600 mb-2" />
            <h3 className="font-bold text-slate-900 mb-1">Live Code Editor</h3>
            <p className="text-sm text-slate-600">
              แก้โค้ดและเห็นผลลัพธ์ได้ทันที ไม่ต้องติดตั้งอะไรเพิ่ม
            </p>
          </div>
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl">
            <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-bold text-slate-900 mb-1">11 บทเรียนครบชุด</h3>
            <p className="text-sm text-slate-600">
              ครอบคลุม Hooks สำคัญ useState, useEffect, Props, Context, Router
            </p>
          </div>
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <Heart className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-bold text-slate-900 mb-1">เนื้อหาภาษาไทย</h3>
            <p className="text-sm text-slate-600">
              อธิบายเข้าใจง่าย เหมาะกับผู้เริ่มต้น React
            </p>
          </div>
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-bold text-slate-900 mb-1">Progress Tracking</h3>
            <p className="text-sm text-slate-600">
              บันทึกว่าอ่านถึงไหนแล้ว ผ่าน Context API
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Tech Stack</h2>
        <ul className="space-y-2 text-slate-700 mb-8">
          <li>⚡ <strong>Vite + React 18</strong> — เครื่องมือ build และ runtime</li>
          <li>🎨 <strong>Tailwind CSS v3</strong> — utility-first CSS framework</li>
          <li>🧭 <strong>react-router-dom v6</strong> — Single Page Application routing</li>
          <li>📝 <strong>react-markdown</strong> — แสดงเนื้อหาบทเรียนจาก markdown</li>
          <li>🧪 <strong>Sandpack (CodeSandbox)</strong> — Live code editor แบบฝัง</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">แหล่งอ้างอิง</h2>
        <p className="text-slate-700 mb-4">
          เนื้อหาบทเรียนอ้างอิงจาก:
        </p>
        <ul className="space-y-2 text-slate-700 mb-8">
          <li>
            📚{' '}
            <a
              href="https://react.dev/learn"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline"
            >
              React Docs — Quick Start & Learn React
            </a>
          </li>
          <li>
            📖 สรุปเนื้อหาบทเรียน Basic React
          </li>
        </ul>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg"
        >
          ← กลับหน้าแรก
        </Link>
      </div>
      <div>
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
    </div>
  );
}