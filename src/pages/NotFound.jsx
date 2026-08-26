import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-3">ไม่พบหน้าที่ค้นหา</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          หน้าที่คุณเข้ามาอาจถูกลบ ย้าย หรือพิมพ์ URL ผิด
          <br />
          ลองกลับไปหน้าแรกเพื่อเริ่มเรียนใหม่
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow-sm"
        >
          <Home className="w-4 h-4" />
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}