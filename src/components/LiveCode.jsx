import { lazy, Suspense } from 'react';

// ใช้ lazy import เพื่อลดขนาด initial bundle (Sandpack bundle ค่อนข้างใหญ่)
const Sandpack = lazy(() =>
  import('@codesandbox/sandpack-react').then((m) => ({ default: m.Sandpack }))
);

export default function LiveCode({ files, options = {} }) {
  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE EDITOR
        </span>
        <span className="text-xs text-slate-500">ลองแก้โค้ดและดูผลลัพธ์ได้ทันที</span>
      </div>
      <Suspense
        fallback={
          <div className="border border-slate-200 rounded-lg p-12 text-center bg-slate-50">
            <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-slate-500">กำลังโหลด editor...</p>
          </div>
        }
      >
        <Sandpack
          template="react"
          theme={{
            colors: {
              surface1: '#ffffff',
              surface2: '#f8fafc',
              surface3: '#e2e8f0',
              clickable: '#475569',
              base: '#0f172a',
              disabled: '#94a3b8',
              hover: '#1e293b',
              accent: '#2563eb',
            },
            syntax: {
              plain: '#0f172a',
              comment: { color: '#94a3b8', fontStyle: 'italic' },
              keyword: '#7c3aed',
              tag: '#dc2626',
              punctuation: '#475569',
              definition: '#2563eb',
              property: '#0891b2',
              static: '#059669',
              string: '#16a34a',
            },
            font: {
              body: '"JetBrains Mono", ui-monospace, monospace',
              mono: '"JetBrains Mono", ui-monospace, monospace',
              size: '13px',
              lineHeight: '1.6',
            },
          }}
          files={files}
          options={{
            showNavigator: false,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: 380,
            ...options,
          }}
        />
      </Suspense>
    </div>
  );
}