# บทที่ 2: JSX & Components

## JSX คืออะไร

**JSX** (JavaScript XML) คือ syntax extension ของ JavaScript ที่ทำให้เราเขียนโครงสร้างคล้าย HTML ในไฟล์ JavaScript ได้

```jsx
const element = <h1>สวัสดี React!</h1>;
```

ถึงจะหน้าตาเหมือน HTML แต่ JSX **ไม่ใช่ HTML** — Browser ไม่เข้าใจ JSX โดยตรง React จะแปลง JSX เป็น `React.createElement()` ให้ก่อนส่งให้ Browser

```jsx
// JSX นี้
const element = <h1 className="title">สวัสดี</h1>;

// ถูกแปลงเป็น
const element = React.createElement('h1', { className: 'title' }, 'สวัสดี');
```

## กฎของ JSX ที่ต้องจำ

### 1. Return ต้องมี root element เดียว

```jsx
// ❌ ผิด — มีหลาย root
function App() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ ถูก — ห่อด้วย Fragment หรือ div
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}
```

### 2. ใช้ camelCase สำหรับ attribute

| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |

### 3. ฝัง JavaScript ด้วย `{}`

```jsx
const name = 'สมชาย';
const score = 95;

function Greeting() {
  return (
    <div>
      <p>สวัสดี {name}</p>
      <p>คะแนน: {score + 5}</p>
      <p>สถานะ: {score >= 50 ? 'ผ่าน' : 'ไม่ผ่าน'}</p>
    </div>
  );
}
```

## Components คือหัวใจของ React

**Component** คือ function (หรือ class) ที่ return UI เป็นชิ้นเล็กๆ ที่นำกลับมาใช้ซ้ำได้

```jsx
function Welcome() {
  return <h1>ยินดีต้อนรับ!</h1>;
}

// ใช้งาน
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}
```

## Function Component vs Arrow Function

```jsx
// แบบ Function declaration
function Button() {
  return <button>คลิก</button>;
}

// แบบ Arrow function
const Button = () => <button>คลิก</button>;
```

ทั้งสองแบบทำงานเหมือนกัน เลือกแบบที่ทีมถนัด

## Exports & Imports

### Default Export — 1 component หลักต่อไฟล์

```jsx
// Button.jsx
export default function Button() {
  return <button>คลิก</button>;
}

// App.jsx
import Button from './Button';
```

### Named Export — ส่งออกหลายอย่างในไฟล์เดียว

```jsx
// utils.jsx
export function Button() { return <button>คลิก</button>; }
export function Input() { return <input />; }

// App.jsx
import { Button, Input } from './utils';
```

> 💡 **Best Practice**: 1 Component หลักต่อ 1 ไฟล์ ใช้ default export ส่วน components เล็กๆ ที่เกี่ยวข้องใช้ named export

## ลองเล่นเอง: สร้าง Profile Card

```jsx live
{
  "files": {
    "/App.jsx": "import ProfileCard from './ProfileCard';\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-sm mx-auto space-y-4\">\n        <ProfileCard\n          name=\"สมชาย ใจดี\"\n          role=\"Frontend Developer\"\n          avatar=\"https://i.pravatar.cc/150?img=12\"\n        />\n        <ProfileCard\n          name=\"สมหญิง รักเรียน\"\n          role=\"UX Designer\"\n          avatar=\"https://i.pravatar.cc/150?img=47\"\n        />\n      </div>\n    </div>\n  );\n}",
    "/ProfileCard.jsx": "export default function ProfileCard({ name, role, avatar }) {\n  return (\n    <div className=\"bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition\">\n      <img src={avatar} alt={name} className=\"w-16 h-16 rounded-full object-cover\" />\n      <div className=\"flex-1 min-w-0\">\n        <h3 className=\"font-bold text-slate-900 truncate\">{name}</h3>\n        <p className=\"text-sm text-slate-500\">{role}</p>\n      </div>\n      <button className=\"px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600\">\n        ติดตาม\n      </button>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; }"
  }
}
```

ลองแก้:
- เปลี่ยน `name`, `role`, `avatar` ดูว่า UI เปลี่ยนยังไง
- เพิ่ม prop ใหม่ เช่น `followers` แล้วแสดงในการ์ด

## สรุป

- **JSX** คือ syntax คล้าย HTML ที่เขียนใน JavaScript ได้
- ใช้ `className` แทน `class`, `onClick` แทน `onclick`
- ฝัง JavaScript expression ด้วย `{}`
- **Component** คือ function ที่ return UI สามารถนำมาประกอบกันได้
- ใช้ **default export** สำหรับ component หลัก และ **named export** สำหรับหลายอย่างในไฟล์เดียว

---

ถัดไปเราจะเรียนเรื่อง **Tailwind CSS** ที่ใช้ในตัวอย่างของเราตลอดหลักสูตร 🎨