# บทที่ 3: แนะนำ Tailwind CSS

## Tailwind คืออะไร

**Tailwind CSS** คือ **utility-first CSS framework** — แทนที่จะเขียน CSS แยก เราจะใช้ "utility class" สำเร็จรูปที่ Tailwind เตรียมไว้ให้ ผ่านทาง HTML/JSX attribute

```jsx
// ❌ แบบเดิม: เขียน CSS แยก
<button className="my-button">คลิก</button>
// + ไฟล์ CSS: .my-button { background: blue; color: white; padding: 8px; }

// ✅ แบบ Tailwind: ใส่ class ใน JSX เลย
<button className="bg-blue-500 text-white px-4 py-2 rounded">คลิก</button>
```

## ข้อดีของ Tailwind

- **เร็ว**: ไม่ต้องสลับไฟล์ไปมาระหว่าง JSX กับ CSS
- **Consistent**: ใช้ design token เดียวกันทั้งโปรเจกต์
- **Bundle เล็ก**: PurgeCSS ลบ class ที่ไม่ได้ใช้ออกตอน build
- **Responsive ง่าย**: ใช้ prefix เช่น `md:`, `lg:` ครอบ class ได้เลย

## Utility Classes ที่ใช้บ่อย

### Layout & Spacing

```jsx
<div className="p-4 m-2">           {/* padding 16px, margin 8px */}
<div className="px-6 py-3">         {/* padding-x 24px, padding-y 12px */}
<div className="space-y-4">         {/* ระยะห่างระหว่าง children แนวตั้ง */}
<div className="flex gap-2">        {/* flex + ระยะห่าง 8px */}
```

### Colors

```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white">
<div className="bg-slate-100 text-slate-900">
<p className="text-red-500">
```

### Typography

```jsx
<h1 className="text-3xl font-bold">   {/* ขนาด 30px, หนา */}
<p className="text-lg leading-relaxed">  {/* 18px, line-height สบายตา */}
<span className="font-mono">         {/* monospace font */}
```

### Borders & Shadows

```jsx
<div className="rounded-xl border border-slate-200 shadow-md">
<input className="rounded-lg border-2 border-gray-300 focus:border-blue-500">
```

### Responsive (Mobile-first)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
{/* mobile: 1 คอลัมน์, tablet: 2, desktop: 3 */}
```

```jsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
{/* ปรับขนาดตาม breakpoint */}
```

## ตัวอย่างจริง: Pricing Card

```jsx live
{
  "files": {
    "/App.jsx": "export default function App() {\n  return (\n    <div className=\"min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8\">\n      <div className=\"max-w-4xl mx-auto grid md:grid-cols-3 gap-6\">\n        <PricingCard\n          tier=\"ฟรี\"\n          price=\"0\"\n          features={['ใช้งาน 1 โปรเจกต์', 'พื้นที่ 100 MB', 'Community support']}\n          highlighted={false}\n        />\n        <PricingCard\n          tier=\"Pro\"\n          price=\"299\"\n          features={['โปรเจกต์ไม่จำกัด', 'พื้นที่ 10 GB', 'Email support', 'Custom domain']}\n          highlighted={true}\n        />\n        <PricingCard\n          tier=\"ทีม\"\n          price=\"999\"\n          features={['ทุกอย่างใน Pro', 'ทีมไม่จำกัดคน', 'Priority support', 'SSO + Audit log']}\n          highlighted={false}\n        />\n      </div>\n    </div>\n  );\n}\n\nfunction PricingCard({ tier, price, features, highlighted }) {\n  return (\n    <div className={`rounded-2xl p-6 ${\n      highlighted\n        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105'\n        : 'bg-white text-slate-900 shadow-md'\n    }`}>\n      <h3 className=\"text-lg font-semibold mb-2\">{tier}</h3>\n      <div className=\"flex items-baseline gap-1 mb-4\">\n        <span className=\"text-4xl font-extrabold\">{price}</span>\n        <span className={highlighted ? 'text-blue-100' : 'text-slate-500'}>/เดือน</span>\n      </div>\n      <ul className=\"space-y-2 mb-6\">\n        {features.map((f, i) => (\n          <li key={i} className=\"flex items-start gap-2 text-sm\">\n            <span className={highlighted ? 'text-yellow-300' : 'text-green-500'}>✓</span>\n            <span>{f}</span>\n          </li>\n        ))}\n      </ul>\n      <button className={`w-full py-2.5 rounded-lg font-medium transition ${\n        highlighted\n          ? 'bg-white text-blue-600 hover:bg-blue-50'\n          : 'bg-blue-500 text-white hover:bg-blue-600'\n      }`}>\n        เลือกแพ็กเกจ\n      </button>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เปลี่ยน `highlighted` เป็น `true` ที่ tier "ฟรี" ดูว่าเกิดอะไรขึ้น
- เพิ่ม tier ใหม่ "Enterprise" พร้อมราคา "4,999"
- ลองเปลี่ยนสีจาก blue → emerald หรือ rose

## เคล็ดลับการใช้ Tailwind กับ React

### 1. จัดกลุ่ม class ที่ใช้บ่อย

```jsx
const cardClasses = 'bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition';

<div className={cardClasses}>...</div>
```

### 2. ใช้ template literal สำหรับ conditional

```jsx
<button className={`px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
```

### 3. ตั้งค่า theme ใน `tailwind.config.js`

```js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
};
```

แล้วใช้ได้เลย: `bg-brand-500`, `text-brand-600`

## สรุป

- **Tailwind** = utility-first CSS ที่เขียน class ใน JSX โดยตรง
- ใช้ **utility classes** สำเร็จรูป: `bg-*`, `text-*`, `p-*`, `flex`, `grid` ฯลฯ
- **Responsive** ง่ายด้วย prefix: `sm:`, `md:`, `lg:`, `xl:`
- ปรับแต่งได้ผ่าน `tailwind.config.js`
- เหมาะกับ React เพราะไม่ต้องสลับไฟล์ CSS

---

บทถัดไป: เรียนเรื่อง **Props** — การส่งข้อมูลระหว่าง Components 📦