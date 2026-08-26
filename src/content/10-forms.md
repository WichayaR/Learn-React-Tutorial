# บทที่ 10: Form & Controlled Components

## Form ในงานจริง

Form เป็นส่วนที่ต้องใช้ในงานจริงแทบทุก Application:

- Login / Register
- Search
- Add Product / Create User
- Checkout / Payment
- Contact Form
- Settings

## Input พื้นฐาน — Controlled Component

```jsx
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="ชื่อของคุณ"
    />
  );
}
```

ตรงนี้ `event.target.value` คือ **ค่าที่ผู้ใช้กำลังพิมพ์**

### Input แบบนี้เรียกว่า Controlled Input

```
Input (พิมพ์)
   ↓ onChange
State (เก็บค่า)
   ↓
value (แสดงผล)
   ↓
Input (แสดงค่ากลับ)
```

React State เป็น **แหล่งข้อมูลหลักเดียว** (Single Source of Truth) ของ Input

## Form ครบชุด — Login

```jsx
import { useState } from 'react';

function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ส่ง:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="อีเมล"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="รหัสผ่าน"
      />
      <label>
        <input
          type="checkbox"
          name="remember"
          checked={form.remember}
          onChange={handleChange}
        />
        จำฉันไว้
      </label>
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  );
}
```

## `e.preventDefault()` ทำไมต้องมี

HTML Form ปกติเมื่อ Submit จะ **Refresh ทั้งหน้า** เพื่อส่งข้อมูลไป Server แบบดั้งเดิม แต่ React ส่วนใหญ่เป็น SPA — ไม่ต้องการ Reload

```jsx
const handleSubmit = (e) => {
  e.preventDefault();  // ⛔ ห้าม refresh หน้า
  // ... ส่งข้อมูล
};
```

## Select & Textarea

**Controlled Select:**
```jsx
function App() {
  const [city, setCity] = useState('bkk');
  return (
    <select value={city} onChange={(e) => setCity(e.target.value)}>
      <option value="bkk">กรุงเทพ</option>
      <option value="cnx">เชียงใหม่</option>
      <option value="hkt">ภูเก็ต</option>
    </select>
  );
}
```

**Controlled Textarea:**
```jsx
function App() {
  const [bio, setBio] = useState('');
  return (
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      placeholder="แนะนำตัว..."
    />
  );
}
```

## Uncontrolled Component (ใช้ ref)

ในบางกรณีอาจไม่ต้อง Controlled — ใช้ `ref` แทน:

```jsx
import { useRef } from 'react';

function App() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ค่า:', inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button>ส่ง</button>
    </form>
  );
}
```

ใช้เมื่อ:
- Form ง่ายๆ ไม่ต้อง validate ตอนพิมพ์
- ต้องการค่าตอน Submit อย่างเดียว

## Validation เบื้องต้น

```jsx
function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('อีเมลไม่ถูกต้อง');
      return;
    }
    setError('');
    // ส่งข้อมูล...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(''); // clear error เมื่อพิมพ์ใหม่
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button>สมัคร</button>
    </form>
  );
}
```

## ลองเล่นเอง: Signup Form

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\n\nexport default function App() {\n  const [form, setForm] = useState({\n    name: '',\n    email: '',\n    password: '',\n    role: 'user',\n    agreed: false,\n  });\n  const [errors, setErrors] = useState({});\n  const [submitted, setSubmitted] = useState(false);\n\n  const handleChange = (e) => {\n    const { name, type, value, checked } = e.target;\n    setForm(prev => ({\n      ...prev,\n      [name]: type === 'checkbox' ? checked : value,\n    }));\n    // clear error เมื่อพิมพ์ใหม่\n    if (errors[name]) {\n      setErrors(prev => ({ ...prev, [name]: '' }));\n    }\n  };\n\n  const validate = () => {\n    const errs = {};\n    if (!form.name.trim()) errs.name = 'กรุณากรอกชื่อ';\n    if (!form.email.includes('@')) errs.email = 'อีเมลไม่ถูกต้อง';\n    if (form.password.length < 6) errs.password = 'รหัสผ่านต้อง ≥ 6 ตัวอักษร';\n    if (!form.agreed) errs.agreed = 'ต้องยอมรับเงื่อนไข';\n    return errs;\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const errs = validate();\n    if (Object.keys(errs).length > 0) {\n      setErrors(errs);\n      return;\n    }\n    setSubmitted(true);\n  };\n\n  // Conditional Rendering\n  if (submitted) {\n    return (\n      <div className=\"min-h-screen bg-green-50 flex items-center justify-center p-8\">\n        <div className=\"bg-white rounded-xl shadow-lg p-8 max-w-md text-center\">\n          <div className=\"text-6xl mb-3\">✅</div>\n          <h1 className=\"text-2xl font-bold mb-2\">สมัครสำเร็จ!</h1>\n          <p className=\"text-slate-600 mb-4\">ยินดีต้อนรับ {form.name}</p>\n          <button\n            onClick={() => {\n              setSubmitted(false);\n              setForm({ name: '', email: '', password: '', role: 'user', agreed: false });\n            }}\n            className=\"px-4 py-2 bg-blue-500 text-white rounded-lg\"\n          >\n            สมัครอีกครั้ง\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  const inputClass = (name) =>\n    `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${\n      errors[name] ? 'border-red-400 bg-red-50' : 'border-slate-300'\n    }`;\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <form onSubmit={handleSubmit} className=\"max-w-md mx-auto bg-white rounded-xl shadow-md p-6 space-y-4\">\n        <h1 className=\"text-2xl font-bold\">📝 สมัครสมาชิก</h1>\n\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">ชื่อ</label>\n          <input\n            name=\"name\"\n            value={form.name}\n            onChange={handleChange}\n            className={inputClass('name')}\n            placeholder=\"สมชาย ใจดี\"\n          />\n          {errors.name && <p className=\"text-red-500 text-sm mt-1\">{errors.name}</p>}\n        </div>\n\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">อีเมล</label>\n          <input\n            type=\"email\"\n            name=\"email\"\n            value={form.email}\n            onChange={handleChange}\n            className={inputClass('email')}\n            placeholder=\"you@example.com\"\n          />\n          {errors.email && <p className=\"text-red-500 text-sm mt-1\">{errors.email}</p>}\n        </div>\n\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">รหัสผ่าน</label>\n          <input\n            type=\"password\"\n            name=\"password\"\n            value={form.password}\n            onChange={handleChange}\n            className={inputClass('password')}\n          />\n          {errors.password && <p className=\"text-red-500 text-sm mt-1\">{errors.password}</p>}\n        </div>\n\n        <div>\n          <label className=\"block text-sm font-medium mb-1\">ประเภทผู้ใช้</label>\n          <select\n            name=\"role\"\n            value={form.role}\n            onChange={handleChange}\n            className=\"w-full border border-slate-300 rounded-lg px-3 py-2\"\n          >\n            <option value=\"user\">ผู้ใช้ทั่วไป</option>\n            <option value=\"admin\">ผู้ดูแล</option>\n            <option value=\"guest\">ผู้มาเยือน</option>\n          </select>\n        </div>\n\n        <label className=\"flex items-center gap-2\">\n          <input\n            type=\"checkbox\"\n            name=\"agreed\"\n            checked={form.agreed}\n            onChange={handleChange}\n          />\n          <span className=\"text-sm\">ยอมรับเงื่อนไขการใช้งาน</span>\n        </label>\n        {errors.agreed && <p className=\"text-red-500 text-sm\">{errors.agreed}</p>}\n\n        <button\n          type=\"submit\"\n          className=\"w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600\"\n        >\n          สมัครสมาชิก\n        </button>\n      </form>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม confirm password field
- เพิ่ม real-time validation (เช็คตอนพิมพ์ทุกครั้ง)
- เพิ่ม password strength meter
- Disable submit button ขณะ submitting

## สรุป

- **Controlled Component** = React State เป็นแหล่งข้อมูลหลัก
- **`onChange`** ดักจับการพิมพ์, **`value`** แสดงผล
- **`e.preventDefault()`** ป้องกัน reload ตอน Submit
- Form pattern: `useState` object + `handleChange` ที่อ่าน `name` จาก target
- **Validation** ทำได้ทั้ง onSubmit และ real-time
- **Uncontrolled** ใช้ `ref` เมื่อไม่ต้องการ React track ค่า

---

ถัดไป: **useEffect Hook** — จัดการ Side Effects และ Fetch API ⏱️