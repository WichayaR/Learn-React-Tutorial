# บทที่ 15: Lifting State & Best Practices

## Lifting State Up — ย้าย State ขึ้น Parent

สมมติมี 2 Component ที่ต้องใช้ข้อมูลเดียวกัน:

```jsx
<SearchBox />
<ProductList />
```

ทั้งสองต้องใช้ `search` query — **ห้ามสร้าง State แยกกัน**

❌ **ไม่ดี:**
```jsx
function SearchBox() {
  const [searchA, setSearchA] = useState('');  // state แยก!
  // ...
}

function ProductList() {
  const [searchB, setSearchB] = useState('');  // state แยก!
  // ...
}
```

✅ **ดี — ย้าย State ขึ้น Parent:**
```jsx
function ProductsPage() {
  const [search, setSearch] = useState('');

  return (
    <>
      <SearchBox search={search} setSearch={setSearch} />
      <ProductList search={search} />
    </>
  );
}
```

**หลักการ:** State ควรอยู่ที่ Component ระดับต่ำสุดที่สามารถแชร์ให้ทุก Component ที่ต้องใช้ได้

## Derived Data — คำนวณจาก State อย่างเดียวพอ

มี State อยู่แล้ว:

```jsx
const [products, setProducts] = useState([...]);
const [search, setSearch] = useState('');
```

❌ **ไม่ต้องสร้าง State อีก:**
```jsx
const [filteredProducts, setFilteredProducts] = useState([]);

useEffect(() => {
  setFilteredProducts(
    products.filter(p => p.name.includes(search))
  );
}, [products, search]);
```

✅ **คำนวณตรงๆ ดีกว่า:**
```jsx
const filteredProducts = products.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);
```

นี่ช่วยลด State ที่ไม่จำเป็น และ React จะ re-compute ทุกครั้งที่ render อัตโนมัติ

## 4 UI States ที่ต้องคิดเสมอ

Component ที่ใช้งานจริงต้องคิดอย่างน้อย **4 สถานะ**:

| State | ตัวอย่าง |
|-------|---------|
| **Loading** | กำลังโหลดข้อมูล |
| **Error** | โหลดไม่สำเร็จ |
| **Empty** | โหลดสำเร็จแต่ไม่มีข้อมูล |
| **Success** | แสดงข้อมูลปกติ |

```jsx
function ProductList() {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage />;
  if (products.length === 0) return <EmptyProduct />;
  return <ProductListView products={products} />;
}
```

> ⚠️ **อย่าคิดเฉพาะกรณี Success** — เพราะในงานจริงทุก State เกิดขึ้นได้หมด

## Environment Variables — `.env`

เวลาทำงานจริง **อย่าเขียน URL Configuration** กระจายไปทุก Component

Vite ใช้ Environment Variable ที่ขึ้นต้นด้วย `VITE_`:

```bash
# .env (ที่ root ของโปรเจกต์)
VITE_API_URL=https://api.example.com
```

ใช้ในโค้ด:
```jsx
const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/products`);
```

### ⚠️ ข้อควรระวัง: อย่าใส่ Secret ฝั่ง Frontend

Environment Variable ที่ส่งไป Frontend **ไม่ใช่ที่เก็บ Secret** เพราะใครก็เปิดดูได้:

- ❌ Database password
- ❌ Private API secret
- ❌ Server secret key

Secret ต้องอยู่ฝั่ง Backend เท่านั้น Frontend ใช้แค่ Public URL

## สิ่งที่ React Beginner ควรเลิกทำ

### 1. หยุด Manipulate DOM เองทุกอย่าง

```jsx
// ❌
document.getElementById('count').innerText = count;

// ✅ ใช้ State
<h1>{count}</h1>
```

### 2. หยุดแก้ State โดยตรง

```jsx
// ❌
products.push(product);
user.name = 'Bob';

// ✅ สร้างค่าใหม่
setProducts([...products, product]);
setUser({ ...user, name: 'Bob' });
```

### 3. หยุดเก็บทุกอย่างเป็น State

```jsx
// ❌
const total = useState(0);
useEffect(() => {
  setTotal(price * quantity);
}, [price, quantity]);

// ✅ คำนวณตรงๆ
const total = price * quantity;
```

### 4. หยุดใช้ useEffect ทุกอย่าง

Effect ไม่ได้มีไว้สำหรับ Logic ธรรมดาทุกชนิด — ใช้เมื่อต้อง sync กับ external system (API, Timer, WebSocket)

### 5. Component ใหญ่เกินไป

ถ้า `App.jsx` ยาว 800 บรรทัด ถามตัวเองว่า:
- ส่วนไหนคือ UI ที่มีหน้าที่ชัดเจน?
- ส่วนไหนใช้ซ้ำได้?
- ส่วนไหนควรแยกเป็น Component?

```jsx
// ❌ App.jsx ทำทุกอย่าง
function App() {
  // login
  // navbar
  // fetch users
  // products
  // cart
  // checkout
  // modal
  // footer
}

// ✅ แบ่งเป็น Component ย่อย
<App>
  <Navbar />
  <ProductPage>
    <ProductFilter />
    <ProductList>
      <ProductCard />
    </ProductList>
  </ProductPage>
  <Cart />
  <Footer />
</App>
```

## CSS ใน React

React ไม่บังคับว่าจะใช้ CSS แบบไหน:

### วิธีที่ 1: CSS ปกติ (แยกไฟล์)

```css
/* ProductCard.css */
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

```jsx
import './ProductCard.css';

function ProductCard() {
  return <div className="card">Product</div>;
}
```

### วิธีที่ 2: Tailwind CSS (utility classes)

```jsx
function ProductCard() {
  return (
    <div className="p-5 border border-slate-200 rounded-lg">
      Product
    </div>
  );
}
```

### สำหรับผู้เริ่มต้น

แนะนำให้เรียน React ด้วย **CSS ปกติก่อน** แล้วค่อยใช้ Tailwind เพราะถ้าเรียนทั้ง React + Tailwind พร้อมกัน อาจสับสนว่าปัญหามาจาก React หรือ CSS

## ลองเล่นเอง: Search + Filter

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\n\nconst PRODUCTS = [\n  { id: 1, name: 'หูฟัง Bluetooth', price: 1290, category: 'audio' },\n  { id: 2, name: 'คีย์บอร์ด Mechanical', price: 3490, category: 'computer' },\n  { id: 3, name: 'เมาส์ไร้สาย', price: 890, category: 'computer' },\n  { id: 4, name: 'จอภาพ 4K', price: 8990, category: 'computer' },\n  { id: 5, name: 'ลำโพงบลูทูธ', price: 1590, category: 'audio' },\n];\n\nfunction SearchBox({ search, setSearch, category, setCategory }) {\n  return (\n    <div className=\"flex gap-2 mb-4\">\n      <input\n        value={search}\n        onChange={e => setSearch(e.target.value)}\n        placeholder=\"ค้นหาสินค้า...\"\n        className=\"flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none\"\n      />\n      <select\n        value={category}\n        onChange={e => setCategory(e.target.value)}\n        className=\"border border-slate-300 rounded-lg px-3 py-2\"\n      >\n        <option value=\"all\">ทั้งหมด</option>\n        <option value=\"audio\">Audio</option>\n        <option value=\"computer\">Computer</option>\n      </select>\n    </div>\n  );\n}\n\nfunction ProductCard({ product }) {\n  return (\n    <div className=\"bg-white p-4 rounded-lg shadow-sm\">\n      <h3 className=\"font-bold\">{product.name}</h3>\n      <p className=\"text-blue-600 font-bold\">฿{product.price.toLocaleString()}</p>\n      <span className=\"text-xs text-slate-500\">{product.category}</span>\n    </div>\n  );\n}\n\nexport default function App() {\n  // State อยู่ที่ Parent เพื่อแชร์ระหว่าง SearchBox และ List\n  const [search, setSearch] = useState('');\n  const [category, setCategory] = useState('all');\n\n  // Derived Data — คำนวณจาก State อย่างเดียว ไม่ต้อง useEffect\n  const filtered = PRODUCTS.filter(p => {\n    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());\n    const matchCategory = category === 'all' || p.category === category;\n    return matchSearch && matchCategory;\n  });\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-2xl mx-auto\">\n        <h1 className=\"text-3xl font-bold mb-2\">🛍️ ร้านค้า</h1>\n        <p className=\"text-slate-600 mb-4\">สินค้า {PRODUCTS.length} รายการ</p>\n\n        <SearchBox\n          search={search}\n          setSearch={setSearch}\n          category={category}\n          setCategory={setCategory}\n        />\n\n        {/* 4 UI States */}\n        {filtered.length === 0 ? (\n          <div className=\"text-center py-12 text-slate-500\">\n            <div className=\"text-4xl mb-2\">🔍</div>\n            <p>ไม่พบสินค้าที่ค้นหา</p>\n          </div>\n        ) : (\n          <div className=\"grid sm:grid-cols-2 gap-3\">\n            {filtered.map(product => (\n              <ProductCard key={product.id} product={product} />\n            ))}\n          </div>\n        )}\n\n        <div className=\"mt-4 text-sm text-slate-500\">\n          แสดง {filtered.length} จาก {PRODUCTS.length} รายการ\n        </div>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม range filter สำหรับ price (min/max)
- Sort ตาม price asc/desc
- เพิ่ม loading state จำลอง (delay 1s)

## Data Flow Pattern สำคัญ

```
Data ลง (Props)
Parent → Child → Grandchild

Events ขึ้น (Callback)
Grandchild → Child → Parent
```

ตัวอย่าง:
```jsx
function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => setTasks([...tasks, { id: Date.now(), text }]);
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <TaskForm onAddTask={addTask} />
    <TaskList tasks={tasks} onDelete={deleteTask} />
  );
}
```

## สรุป

- **Lifting State Up**: ย้าย State ไปยัง Parent ที่ต่ำสุดที่แชร์ได้
- **Derived Data**: คำนวณจาก State อย่างเดียว ไม่ต้องสร้าง State ใหม่
- **4 UI States**: Loading / Error / Empty / Success
- **Environment Variables**: `VITE_*` ใน `.env`, **อย่าใส่ secret**
- **5 สิ่งที่ควรเลิกทำ**: Manipulate DOM, mutate State, ทุกอย่างเป็น State, useEffect ทุกอย่าง, Component ใหญ่เกินไป
- **Data ลง / Events ขึ้น** — Pattern หลักของ React

---

ถัดไป: **MERN Architecture** — ภาพรวมการเชื่อมกับ Backend จริง 🏗️