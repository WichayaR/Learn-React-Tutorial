# บทที่ 3: โครงสร้างโปรเจกต์ React

## เริ่มโปรเจกต์ด้วย Vite

**Vite** คือ Build Tool + Dev Server สำหรับ React สมัยใหม่ ติดตั้งง่าย เร็ว และเป็นที่นิยมที่สุดในปัจจุบัน

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

เมื่อรันสำเร็จ Terminal จะแสดง URL:

```
➜ Local: http://localhost:5173/
```

> 💡 **Vite vs CRA**: ปัจจุบัน React Docs เองก็แนะนำ Vite แทน Create React App (ซึ่งเลิกพัฒนาแล้ว)

## โครงสร้างไฟล์ที่ Vite สร้างให้

```
my-react-app/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

ไฟล์สำคัญ 3 ตัวที่ต้องรู้จัก:

| ไฟล์ | บทบาท |
|------|--------|
| `index.html` | HTML หลัก มี `<div id="root">` ให้ React มาทำงาน |
| `src/main.jsx` | Entry Point — เริ่มต้น React และ render `<App />` ใส่ root |
| `src/App.jsx` | Component หลักของ Application |

### `index.html`
```html
<!doctype html>
<html lang="th">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### `src/App.jsx`
```jsx
function App() {
  return (
    <div>
      <h1>Hello React</h1>
    </div>
  );
}
export default App;
```

## โครงสร้างที่เหมาะกับงานจริง

เมื่อโปรเจกต์เริ่มใหญ่ ห้ามรวมทุกอย่างไว้ใน `App.jsx` แยกตามหน้าที่:

```
src/
├── assets/             # รูป / icon / static files
├── components/         # UI ที่ใช้ซ้ำ
│   ├── Navbar.jsx
│   ├── Button.jsx
│   └── ProductCard.jsx
├── pages/              # Component ระดับหน้า
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   └── Login.jsx
├── context/            # Shared State
│   └── AuthContext.jsx
├── services/           # ติดต่อ API
│   └── productService.js
├── data/               # Static Data
│   └── products.js
├── App.jsx
├── main.jsx
└── index.css
```

หลักการ:

- **components** = UI ที่ใช้ซ้ำ (Button, Card, Modal)
- **pages** = Component ระดับหน้า (Home, Products)
- **context** = Shared State (Auth, Cart, Theme)
- **services** = ฟังก์ชันเรียก API แยกจาก Component
- **data** = Static/mock data

## แยก API ออกจาก Component

มือใหม่มักเขียน `fetch` ใน Component โดยตรง เมื่อโปรเจกต์ใหญ่ ควรแยกออก:

**❌ แบบที่ไม่ดี:**
```jsx
function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);
  // ...
}
```

**✅ แยกเป็น `services/productService.js`:**
```js
export async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  if (!res.ok) throw new Error('Cannot fetch products');
  return res.json();
}
```

**Component จะสะอาดขึ้น:**
```jsx
import { getProducts } from '../services/productService';

function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);
  // Component โฟกัสแค่ UI + State
}
```

## ลองเล่นเอง: สร้าง Mini Project ตามโครงสร้าง

```jsx live
{
  "files": {
    "/App.jsx": "import { useState } from 'react';\nimport { products } from './data/products';\nimport ProductList from './components/ProductList';\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-2xl mx-auto\">\n        <h1 className=\"text-3xl font-bold mb-2\">📁 โครงสร้างโปรเจกต์</h1>\n        <p className=\"text-slate-600 mb-6\">\n          ตัวอย่างนี้แยกเป็น 3 ไฟล์: data/products.js → services/api.js → components/ProductList.jsx\n        </p>\n        <ProductList />\n      </div>\n    </div>\n  );\n}",
    "/data/products.js": "export const products = [\n  { id: 1, name: 'หูฟัง Bluetooth', price: 1290, emoji: '🎧' },\n  { id: 2, name: 'คีย์บอร์ด', price: 2490, emoji: '⌨️' },\n  { id: 3, name: 'เมาส์ไร้สาย', price: 890, emoji: '🖱️' },\n];",
    "/services/api.js": "import { products } from '../data/products';\n\nexport async function getProducts() {\n  // จำลอง async เหมือน fetch จริง\n  await new Promise(r => setTimeout(r, 300));\n  return products;\n}",
    "/components/ProductList.jsx": "import { useEffect, useState } from 'react';\nimport { getProducts } from '../services/api';\n\nexport default function ProductList() {\n  const [products, setProducts] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    getProducts()\n      .then(setProducts)\n      .finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <p className=\"text-slate-500\">กำลังโหลด...</p>;\n\n  return (\n    <div className=\"grid sm:grid-cols-3 gap-3\">\n      {products.map(p => (\n        <div key={p.id} className=\"bg-white p-4 rounded-lg shadow-sm\">\n          <div className=\"text-4xl\">{p.emoji}</div>\n          <div className=\"font-medium\">{p.name}</div>\n          <div className=\"text-blue-600 font-bold\">฿{p.price}</div>\n        </div>\n      ))}\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม `services/api.js` ให้รับ `id` แล้ว return สินค้าเดียว
- เพิ่ม `pages/ProductDetail.jsx` แล้ว wire route ผ่าน react-router
- แยก `ProductCard` ออกเป็น component ใน `components/ProductCard.jsx`

## สรุป

- **Vite** คือเครื่องมือสร้างโปรเจกต์ React ที่แนะนำในปัจจุบัน
- ไฟล์หลัก 3 ตัว: `index.html` → `main.jsx` → `App.jsx`
- **โครงสร้างที่ดี**: แยก `components/`, `pages/`, `context/`, `services/`, `data/`
- **แยก API** ออกเป็น service layer — Component โฟกัสแค่ UI
- เมื่อโปรเจกต์ใหญ่ขึ้น การแยกไฟล์ทำให้ดูแลง่ายและ reuse ได้

---

ถัดไป: เรียนเรื่อง **Tailwind CSS** เพื่อตกแต่ง UI ให้สวยงามโดยไม่ต้องเขียน CSS เยอะ 🎨