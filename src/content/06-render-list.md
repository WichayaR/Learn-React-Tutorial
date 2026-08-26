# บทที่ 6: Render List & Conditional Rendering

## ทำไมต้อง Render List

React ต้องแสดงผลข้อมูลหลายๆ ชิ้น เช่น รายการสินค้า, รายการโพสต์, รายการ comment — ถ้าเขียนทีละตัวจะไม่จบ

## Render Array ด้วย `.map()`

สมมติมีข้อมูล:

```jsx
const products = [
  { id: 1, name: 'Keyboard', price: 1290 },
  { id: 2, name: 'Mouse', price: 590 },
  { id: 3, name: 'Monitor', price: 4990 },
];
```

**❌ อย่าเขียนแบบนี้:**
```jsx
<ProductCard />
<ProductCard />
<ProductCard />
```

**✅ ใช้ `.map()`:**
```jsx
{products.map((product) => (
  <ProductCard
    key={product.id}
    name={product.name}
    price={product.price}
  />
))}
```

## key Prop คืออะไร

เวลา Render List React ต้องรู้ว่า Item แต่ละตัวคือใคร จึงต้องมี `key`

```jsx
{products.map((product) => (
  <ProductCard key={product.id} {...product} />
))}
```

**key ที่ดีควร:**
- ✅ Unique (ไม่ซ้ำ)
- ✅ Stable (ไม่เปลี่ยน)
- ✅ เชื่อมโยงกับ Item จริง (เช่น Database ID)

**❌ หลีกเลี่ยง:**
```jsx
{products.map((product, index) => (
  <ProductCard key={index} {...product} />
))}
```

เพราะถ้ารายการมีการเพิ่ม ลบ หรือเรียงใหม่ React อาจจับคู่ Item ผิดตัว

> 💡 React จะเตือนใน Console ถ้าลืมใส่ `key` ใน List

## Conditional Rendering

React ต้องแสดง UI ตามเงื่อนไขบ่อยมาก เช่น:

- Login แล้ว → แสดง Dashboard
- ยังไม่ Login → แสดงปุ่ม Login
- Admin → แสดงปุ่มลบ
- User ทั่วไป → ซ่อนปุ่มลบ

### วิธีที่ 1: Ternary Operator `? :`

```jsx
{isLogin ? (
  <h1>Welcome back!</h1>
) : (
  <button>Login</button>
)}
```

### วิธีที่ 2: Logical AND `&&`

ถ้าต้องการแสดงเฉพาะตอน `true`:

```jsx
{isAdmin && <button>Delete User</button>}
```

ถ้า `isAdmin` เป็น `false` จะแสดง `false` ใน DOM ซึ่งไม่ render อะไรออกมา

> ⚠️ **ระวัง**: อย่าใช้ `&&` กับตัวเลข เช่น `{count && <h1>...</h1>}` เพราะถ้า `count === 0` จะ render เลข 0 ออกมา ให้ใช้ `count > 0 &&` แทน

### วิธีที่ 3: Early Return (สำหรับเงื่อนไขซับซ้อน)

```jsx
function UserProfile({ user }) {
  if (!user) return <p>กรุณา Login</p>;
  if (user.banned) return <p>บัญชีถูกระงับ</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### วิธีที่ 4: ก่อน return ใช้ if/else ตัวแปร

```jsx
function App() {
  const [age, setAge] = useState(20);
  let message;
  if (age >= 18) {
    message = 'Adult';
  } else {
    message = 'Child';
  }
  return <h1>{message}</h1>;
}
```

หรือสั้นๆ ด้วย ternary:
```jsx
return <h1>{age >= 18 ? 'Adult' : 'Child'}</h1>;
```

## ลองเล่นเอง: Todo App

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\n\nconst initial = = [\n  { id: 1, text: 'เรียน JSX & Components', done: true },\n  { id: 2, text: 'เรียน .map() และ key', done: false },\n  { id: 3, text: 'ทำ Conditional Rendering', done: false },\n];\n\nexport default function App() {\n  const [todos, setTodos] = useState(initial);\n  const [filter, setFilter] = useState('all'); // all | done | pending\n  const [input, setInput] = useState('');\n\n  const visibleTodos = todos.filter(t => {\n    if (filter === 'done') return t.done;\n    if (filter === 'pending') return !t.done;\n    return true;\n  });\n\n  const addTodo = () => {\n    if (!input.trim()) return;\n    setTodos([...todos, { id: Date.now(), text: input, done: false }]);\n    setInput('');\n  };\n\n  const toggle = (id) =>\n    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-md mx-auto bg-white rounded-xl shadow-md p-6\">\n        <h1 className=\"text-2xl font-bold mb-4\">📋 Todo App</h1>\n\n        <div className=\"flex gap-2 mb-4\">\n          <input\n            value={input}\n            onChange={e => setInput(e.target.value)}\n            onKeyDown={e => e.key === 'Enter' && addTodo()}\n            className=\"flex-1 border rounded-lg px-3 py-2\"\n            placeholder=\"เพิ่ม todo...\"\n          />\n          <button onClick={addTodo} className=\"px-4 py-2 bg-blue-500 text-white rounded-lg\">\n            เพิ่ม\n          </button>\n        </div>\n\n        {/* Conditional Rendering ด้วย filter */}\n        <div className=\"flex gap-2 mb-4\">\n          {['all', 'pending', 'done'].map(f => (\n            <button\n              key={f}\n              onClick={() => setFilter(f)}\n              className={`px-3 py-1 rounded-full text-sm ${\n                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'\n              }`}\n            >\n              {f === 'all' ? 'ทั้งหมด' : f === 'done' ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ'}\n            </button>\n          ))}\n        </div>\n\n        {/* Conditional: ถ้าไม่มี todo ใน filter */}\n        {visibleTodos.length === 0 ? (\n          <p className=\"text-center text-slate-500 py-8\">\n            {filter === 'done' ? 'ยังไม่มี todo ที่เสร็จ' : 'เพิ่ม todo แรกของคุณ!'}\n          </p>\n        ) : (\n          // Render list ด้วย .map() + key\n          <ul className=\"space-y-2\">\n            {visibleTodos.map(todo => (\n              <li key={todo.id} className=\"flex items-center gap-2 p-2 rounded hover:bg-slate-50\">\n                <input\n                  type=\"checkbox\"\n                  checked={todo.done}\n                  onChange={() => toggle(todo.id)}\n                />\n                <span className={`flex-1 ${todo.done ? 'line-through text-slate-400' : ''}`}>\n                  {todo.text}\n                </span>\n              </li>\n            ))}\n          </ul>\n        )}\n\n        <div className=\"mt-4 pt-4 border-t text-sm text-slate-500\">\n          ✅ เสร็จแล้ว {todos.filter(t => t.done).length} / {todos.length}\n        </div>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่มปุ่ม "ลบ" ในแต่ละ todo
- เพิ่ม "ล้างที่เสร็จแล้วทั้งหมด" (แสดงเฉพาะเมื่อมี todo ที่เสร็จ)
- เพิ่ม priority (สูง/กลาง/ต่ำ) พร้อม sort

## สรุป

- **Render List** ใช้ `.map()` แทนการเขียน JSX ซ้ำ
- **`key` prop** ต้อง unique และ stable — ใช้ ID จริง ไม่ใช่ index
- **Conditional Rendering** 4 วิธี:
  1. **Ternary** `? :` — เมื่อมี 2 ทางเลือก
  2. **`&&`** — เมื่อแสดงเฉพาะตอน true
  3. **Early return** — เมื่อเงื่อนไขซับซ้อน
  4. **ตัวแปร** — คำนวณก่อน return

---

ถัดไป: **Props** — ส่งข้อมูลจาก Parent ไปยัง Child 📦