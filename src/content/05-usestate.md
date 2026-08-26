# บทที่ 5: useState Hook

## useState คืออะไร

**useState** คือ Hook พื้นฐานที่สุดใน React ใช้สร้าง **state** (ตัวแปรที่เมื่อค่าเปลี่ยน จะทำให้ Component re-render)

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  //        ↑         ↑              ↑
  //     ค่าปัจจุบัน  ตัวอัปเดต   ค่าเริ่มต้น
}
```

## กลไกเบื้องหลัง

เมื่อเรียก `setCount(newValue)` React จะ:

1. เก็บค่าใหม่ใน state
2. บอก React ว่า "Component นี้ต้อง re-render"
3. React เรียก Component function ใหม่ ด้วยค่า state ใหม่
4. UI อัปเดต

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>นับ: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>รีเซ็ต</button>
    </div>
  );
}
```

## กฎสำคัญของ useState

### 1. ต้องเรียกที่ top-level ของ component

```jsx
function Bad() {
  if (something) {
    const [x, setX] = useState(0);  // ❌ ผิด!
  }
}
```

### 2. ต้องเรียกตามลำดับเดิมเสมอ

ตัว React จัดการ state ผ่าน "hook order" ถ้าสับหลั่บกันจะพัง

### 3. ใช้ชื่อ state ให้สื่อความหมาย

```jsx
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [items, setItems] = useState([]);
const [user, setUser] = useState(null);
```

## อัปเดต State แบบต่างๆ

### 1. แบบตรงๆ

```jsx
setCount(10);
setName('สมชาย');
```

### 2. จากค่าก่อนหน้า (Functional update)

สำคัญมากเมื่ออัปเดตหลายครั้งใน event เดียว:

```jsx
// ❌ อาจใช้ค่าเก่า
setCount(count + 1);
setCount(count + 1);  // ทั้งสองบรรทัดใช้ count เดิม

// ✅ ปลอดภัย — รับ previous state
setCount(prev => prev + 1);
setCount(prev => prev + 1);  // ได้ +2 จริง
```

### 3. อัปเดต object/array (Immutability!)

```jsx
// ❌ ห้าม mutate โดยตรง
user.name = 'ใหม่';
setUser(user);

// ✅ สร้าง object ใหม่
setUser({ ...user, name: 'ใหม่' });

// ❌ ห้าม push
items.push(newItem);
setItems(items);

// ✅ สร้าง array ใหม่
setItems([...items, newItem]);
setItems(items.filter(i => i.id !== id));  // ลบ
setItems(items.map(i => i.id === id ? { ...i, done: true } : i));  // แก้ไข
```

## useState กับ Form

```jsx
function SignupForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form className="space-y-3">
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="อีเมล"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="รหัสผ่าน"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="agreed"
          checked={form.agreed}
          onChange={handleChange}
        />
        ยอมรับเงื่อนไข
      </label>
    </form>
  );
}
```

## ลองเล่นเอง: Todo List

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\n\nexport default function App() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: 'เรียน useState', done: true },\n    { id: 2, text: 'ทำแบบฝึกหัด', done: false },\n    { id: 3, text: 'อ่านเอกสาร React', done: false },\n  ]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (!input.trim()) return;\n    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);\n    setInput('');\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));\n  };\n\n  const removeTodo = (id) => {\n    setTodos(prev => prev.filter(t => t.id !== id));\n  };\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-md mx-auto bg-white rounded-xl shadow-md p-6\">\n        <h1 className=\"text-2xl font-bold mb-4\">📝 Todo List</h1>\n\n        <div className=\"flex gap-2 mb-4\">\n          <input\n            value={input}\n            onChange={e => setInput(e.target.value)}\n            onKeyDown={e => e.key === 'Enter' && addTodo()}\n            className=\"flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none\"\n            placeholder=\"เพิ่ม todo ใหม่...\"\n          />\n          <button\n            onClick={addTodo}\n            className=\"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium\"\n          >\n            เพิ่ม\n          </button>\n        </div>\n\n        <ul className=\"space-y-2\">\n          {todos.map(todo => (\n            <li\n              key={todo.id}\n              className=\"flex items-center gap-2 p-2 rounded hover:bg-slate-50\"\n            >\n              <input\n                type=\"checkbox\"\n                checked={todo.done}\n                onChange={() => toggleTodo(todo.id)}\n                className=\"w-4 h-4\"\n              />\n              <span className={`flex-1 ${todo.done ? 'line-through text-slate-400' : ''}`}>\n                {todo.text}\n              </span>\n              <button\n                onClick={() => removeTodo(todo.id)}\n                className=\"text-red-500 hover:text-red-700 text-sm\"\n              >\n                ลบ\n              </button>\n            </li>\n          ))}\n        </ul>\n\n        <div className=\"mt-4 pt-4 border-t text-sm text-slate-500\">\n          ทำเสร็จ {todos.filter(t => t.done).length} / {todos.length}\n        </div>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่มฟีเจอร์ "ลบทั้งหมดที่ทำเสร็จแล้ว"
- เพิ่ม input สำหรับ filter "เฉพาะที่ยังไม่เสร็จ"
- เพิ่ม priority (สูง/กลาง/ต่ำ) พร้อมสี

## สรุป

- **useState** สร้าง state ที่ trigger re-render เมื่อค่าเปลี่ยน
- Syntax: `const [value, setValue] = useState(initial)`
- ใช้ **functional update** (`setX(prev => ...)`) เมื่อต้องอัปเดตหลายครั้ง
- **Object/Array**: ห้าม mutate ต้องสร้างใหม่เสมอ (`{...obj}`, `[...arr]`)
- ใช้กับ Form ได้สะดวกด้วย pattern `name` + `onChange`

---

ถัดไป: **useEffect Hook** — จัดการ Side Effects ⏱️