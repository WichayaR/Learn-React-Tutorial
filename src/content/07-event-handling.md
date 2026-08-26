# บทที่ 7: Event Handling

## Event ใน React

React ใช้ **Synthetic Events** — wrapper รอบ native DOM events เพื่อให้ทำงานเหมือนกันทุก browser

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('คลิกแล้ว!', e.target);
  };

  return <button onClick={handleClick}>คลิก</button>;
}
```

## Event ที่ใช้บ่อย

| Event | ใช้กับ | ตัวอย่าง |
|-------|--------|---------|
| `onClick` | ปุ่ม, div, อะไรก็ได้ | `<button onClick={...}>` |
| `onChange` | input, select, textarea | `<input onChange={...}>` |
| `onSubmit` | form | `<form onSubmit={...}>` |
| `onFocus` / `onBlur` | input | focus state |
| `onKeyDown` / `onKeyUp` / `onKeyPress` | input | keyboard shortcuts |
| `onMouseEnter` / `onMouseLeave` | hover | tooltips |
| `onDoubleClick` | double click | เปิด/ปิด detail |

## Passing Arguments

```jsx
function List() {
  const items = ['A', 'B', 'C'];

  const handleClick = (id, e) => {
    console.log('คลิก', id);
  };

  return (
    <ul>
      {items.map((item, idx) => (
        <li key={idx} onClick={(e) => handleClick(idx, e)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## Form Events

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // ป้องกัน reload หน้า
    console.log('ส่ง:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="อีเมล"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="รหัสผ่าน"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
```

## Keyboard Events

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('ค้นหา:', query);
    }
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="กด Enter เพื่อค้นหา, Esc เพื่อล้าง"
    />
  );
}
```

## Event Bubbling & Stop Propagation

```jsx
function Card() {
  return (
    <div
      onClick={() => console.log('Card clicked')}
      className="p-4 border rounded"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();  // ไม่ให้ bubble ขึ้นไป div
          console.log('Button clicked');
        }}
      >
        คลิก
      </button>
    </div>
  );
}
```

## ลองเล่นเอง: Color Picker

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\n\nexport default function App() {\n  const [color, setColor] = useState('#3b82f6');\n  const [history, setHistory] = useState([]);\n\n  const handleChange = (e) => {\n    const newColor = e.target.value;\n    setHistory(prev => [color, ...prev].slice(0, 8));\n    setColor(newColor);\n  };\n\n  const handleKeyDown = (e) => {\n    if (e.key === 'r' || e.key === 'R') setColor('#ef4444');\n    if (e.key === 'g' || e.key === 'G') setColor('#10b981');\n    if (e.key === 'b' || e.key === 'B') setColor('#3b82f6');\n    if (e.key === 'c' || e.key === 'C') setColor('#000000');\n  };\n\n  return (\n    <div\n      className=\"min-h-screen flex items-center justify-center p-8 transition-colors\"\n      style={{ backgroundColor: color }}\n      onKeyDown={handleKeyDown}\n      tabIndex={0}\n    >\n      <div className=\"bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full\">\n        <h1 className=\"text-2xl font-bold mb-4\">🎨 Color Picker</h1>\n\n        <input\n          type=\"color\"\n          value={color}\n          onChange={handleChange}\n          className=\"w-full h-16 rounded-lg cursor-pointer\"\n        />\n\n        <div className=\"mt-4 p-4 bg-slate-50 rounded-lg\">\n          <div className=\"text-sm text-slate-500\">ค่าปัจจุบัน</div>\n          <div className=\"font-mono text-2xl font-bold\">{color}</div>\n        </div>\n\n        <div className=\"mt-4\">\n          <div className=\"text-sm font-semibold mb-2\">\n            ⌨️ กดคีย์ลัด (คลิกที่การ์ดก่อน):\n          </div>\n          <div className=\"grid grid-cols-2 gap-2 text-sm\">\n            <kbd className=\"px-2 py-1 bg-slate-100 rounded\">R</kbd><span>แดง</span>\n            <kbd className=\"px-2 py-1 bg-slate-100 rounded\">G</kbd><span>เขียว</span>\n            <kbd className=\"px-2 py-1 bg-slate-100 rounded\">B</kbd><span>น้ำเงิน</span>\n            <kbd className=\"px-2 py-1 bg-slate-100 rounded\">C</kbd><span>ดำ</span>\n          </div>\n        </div>\n\n        {history.length > 0 && (\n          <div className=\"mt-4\">\n            <div className=\"text-sm font-semibold mb-2\">ประวัติ</div>\n            <div className=\"flex gap-1\">\n              {history.map((c, i) => (\n                <button\n                  key={i}\n                  onClick={() => setColor(c)}\n                  className=\"w-8 h-8 rounded border-2 border-white shadow-sm hover:scale-110 transition\"\n                  style={{ backgroundColor: c }}\n                  title={c}\n                />\n              ))}\n            </div>\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่มปุ่ม "สุ่มสี" ใช้ `Math.random()` สร้าง hex color
- บันทึกลง localStorage ด้วย `useEffect`
- เพิ่ม input range สำหรับ opacity

## สรุป

- ใช้ **camelCase**: `onClick`, `onChange`, `onKeyDown`
- ส่ง **function** ไม่ใช่ string (ต่างจาก HTML ปกติ)
- `e.preventDefault()` ป้องกัน behavior  default (เช่น form reload)
- `e.stopPropagation()` หยุดไม่ให้ event bubble ขึ้น parent
- Synthetic Events ทำงานเหมือนกันทุก browser

---

ถัดไป: **API Integration** — เชื่อมต่อ Backend ด้วย fetch 🌐