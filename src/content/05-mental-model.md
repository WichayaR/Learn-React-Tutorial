# บทที่ 5: React Mental Model

## ก่อนเริ่ม React ต้องเปลี่ยนวิธีคิด

ถ้าเราเขียนเว็บด้วย HTML + CSS + JavaScript ปกติ เราจะคิดแบบนี้:

```
HTML  = โครงสร้าง
CSS   = หน้าตา
JS    = ไปแก้ HTML เมื่อมีอะไรเกิดขึ้น
```

### ตัวอย่าง JavaScript แบบเดิม

```html
<h1 id="count">0</h1>
<button id="increase">Increase</button>
<script>
  let count = 0;
  document.getElementById('increase').addEventListener('click', function () {
    count++;
    document.getElementById('count').innerText = count;
  });
</script>
```

เราต้องบอก Browser โดยตรงว่า:

1. หา element นี้
3. แล้วเปลี่ยนข้อความของมัน

## React เปลี่ยนวิธีคิด

React ถามว่า:

> **"UI ตอนนี้ควรหน้าตาอย่างไร เมื่อข้อมูลของเราเป็นแบบนี้?"**

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </>
  );
}
```

เรา **ไม่ได้สั่ง** `document.getElementById(...)` แต่ **บอกว่า**:

- `<h1>{count}</h1>` = ตรงนี้ให้แสดงค่าของ `count`
- ถ้า `count` เปลี่ยน React จะจัดการ Update UI ให้

นี่คือ **Mental Model** สำคัญที่สุดของ React

## Declarative vs Imperative

| | Imperative (JavaScript ปกติ) | Declarative (React) |
|---|---|---|
| **แนวคิด** | บอกว่า "ทำยังไง" ทีละขั้น | บอกว่า "อยากได้ผลลัพธ์อะไร" |
| **UI Update** | ต้องไปแก้ DOM เอง | React จัดการให้ |
| **ตัวอย่าง** | `element.innerText = count` | `<h1>{count}</h1>` |

```
Data / State
    ↓
Component (ฟังก์ชัน)
    ↓
JSX (คำอธิบาย UI)
    ↓
UI (ผลลัพธ์)
```

React เรียกแนวคิดนี้ว่า **Declarative UI**

## React Component คืออะไร

> Component Application ประกอบขึ้นจาก Component ซึ่งเป็นชิ้นส่วน UI ที่มีทั้ง Logic และ Appearance ของตัวเอง — React Docs

Component อาจเล็กแค่ปุ่มเดียว หรือใหญ่ระดับทั้งหน้าก็ได้ มอง UI เป็น Component Tree:

```
App
├── Navbar
├── Header
├── ProductList
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

**จุดแข็งของ Component:**
- แยกความรับผิดชอบ
- นำกลับมาใช้ซ้ำได้
- รับข้อมูลต่างกัน
- มี State ของตัวเอง
- มี Event ของตัวเอง
- ประกอบกันเป็น UI ขนาดใหญ่

## Hooks คืออะไร

**Hook** คือ Function พิเศษของ React ที่เปิดให้ Function Component ใช้ความสามารถต่างๆ ของ React

| Hook | ใช้ทำอะไร |
|------|-----------|
| `useState()` | จัดการ State |
| `useEffect()` | จัดการ Side Effect |
| `useContext()` | อ่าน Context |

Hook จะขึ้นต้นด้วย `use...`

## Rules of Hooks — กฎเหล็ก

1. **เรียก Hook ที่ Top Level** ของ Component เท่านั้น
2. ห้ามเรียกใน `if`, `for`, function ซ้อน
4. ต้องเรียกตามลำดับเดิมเสมอ

**✅ ถูก:**
```jsx
function App() {
  const [count, setCount] = useState(0);
  return <h1>{count}</h1>;
}
```

**❌ ผิด:**
```jsx
function App() {
  if (true) {
    const [count, setCount] = useState(0);  // ❌ ห้าม!
  }
}
```

ทำไม? เพราะ React ใช้ลำดับการเรียก Hook เพื่อจับคู่ State กับ Component ถ้าสับหลั่งจะพัง

## React Mental Model 8 เรื่องที่ต้องจำ

1. **UI คือ Component Tree**
2. **Component คือ Function** ที่ return UI
3. **Props คือ Input** ของ Component
4. **State คือ Memory** ของ Component
5. **State เปลี่ยน → React Render ใหม่**
6. **Array → ใช้ `.map()`** ในการ render list
7. **Effect → Synchronize** กับระบบภายนอก (API, Timer)
8. **Shared State หลายระดับ → Context**

## ลองเล่นเอง: เปรียบเทียบ Imperative vs Declarative

```jsx live
{
  "files": {
    "/App.jsx": "import { useState, useEffect, useRef } from 'react';\n\n// === 1. Imperative (Vanilla JS) — ต้องสั่งทีละขั้น ===\nfunction ImperativeCounter() {\n  const ref = useRef(null);\n  const btnRef = useRef(null);\n\n  useEffect(() => {\n    let count = 0;\n    const h1 = ref.current;\n    const btn = btnRef.current;\n    const handle = () => {\n      count++;\n      h1.innerText = `นับ: ${count}`;\n    };\n    btn.addEventListener('click', handle);\n    return () => btn.removeEventListener('click', handle);\n  }, []);\n\n  return (\n    <div className=\"bg-red-50 border border-red-200 rounded-lg p-4\">\n      <div className=\"text-xs font-semibold text-red-700 mb-2\">❌ IMPERATIVE (vanilla JS ใน React)</div>\n      <h1 ref={ref} className=\"text-2xl font-bold mb-2\">นับ: 0</h1>\n      <button ref={btnRef} className=\"px-4 py-2 bg-red-500 text-white rounded\">+1</button>\n    </div>\n  );\n}\n\n// === 2. Declarative (React) — บอกแค่ว่าอยากได้อะไร ===\nfunction DeclarativeCounter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className=\"bg-green-50 border border-green-200 rounded-lg p-4\">\n      <div className=\"text-xs font-semibold text-green-700 mb-2\">✅ DECLARATIVE (React)</div>\n      <h1 className=\"text-2xl font-bold mb-2\">นับ: {count}</h1>\n      <button\n        onClick={() => setCount(count + 1)}\n        className=\"px-4 py-2 bg-green-500 text-white rounded\"\n      >\n        +1\n      </button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-md mx-auto space-y-4\">\n        <h1 className=\"text-2xl font-bold\">Mental Model: 2 วิธีคิด</h1>\n        <ImperativeCounter />\n        <DeclarativeCounter />\n        <p className=\"text-sm text-slate-600 mt-4\">\n          💡 ทั้งสองทำงานเหมือนกัน แต่ React (ด้านล่าง) สั้นกว่า อ่านง่ายกว่า และไม่ต้องจัดการ DOM เอง\n        </p>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่มปุ่ม "Reset" ใน DeclarativeCounter
- เพิ่ม "-1" ในทั้งสองแบบ เทียบกันว่าแบบไหนแก้ง่ายกว่า
- สังเกตว่าแบบ imperative มี boilerplate (useRef, useEffect cleanup) เยอะกว่ามาก

## สรุป

- **เปลี่ยนวิธีคิด**: จาก "บอกทีละขั้น" เป็น "บอกผลลัพธ์ที่อยากได้"
- **React = Declarative UI** — Component รับ State → return JSX → UI
- **Hook** คือ Function พิเศษที่ขึ้นต้นด้วย `use...`
- **Rules of Hooks**: เรียกที่ top level เท่านั้น
- **8 Mental Models** ที่ต้องจำให้ได้

---

ถัดไป: **Render List & Conditional** — ใช้ `.map()`, `key`, ternary และ `&&` แสดงผลแบบมีเงื่อนไข 📋