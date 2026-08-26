# บทที่ 10: Context API

## ปัญหา Prop Drilling

เมื่อ Component ลึกหลายชั้น ต้อง "ส่ง Props ทอด" ผ่านทุกชั้นที่ไม่ได้ใช้ข้อมูลนั้นเลย:

```jsx
function App() {
  const [user, setUser] = useState({ name: 'สมชาย' });
  return <Layout user={user} setUser={setUser} />;        // ชั้น 1
}

function Layout({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;      // ชั้น 2 (ไม่ได้ใช้ แต่ต้องส่งต่อ)
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;     // ชั้น 3 (ไม่ได้ใช้ แต่ต้องส่งต่อ)
}

function UserMenu({ user, setUser }) {                    // ชั้น 4 — ใช้จริงที่นี่
  return <p>{user.name}</p>;
}
```

**Prop Drilling** = ปัญหานี้แหละ Context API แก้ได้

## Context API — 3 ขั้นตอน

### 1️⃣ `createContext()` — สร้าง Context

```jsx
import { createContext } from 'react';

const UserContext = createContext(null);  // null = default value
```

### 2️⃣ `<Context.Provider>` — ส่งค่าให้ Children

```jsx
function App() {
  const [user, setUser] = useState({ name: 'สมชาย' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}
```

### 3️⃣ `useContext()` — ดึงค่าใน Child ใดก็ได้

```jsx
import { useContext } from 'react';

function UserMenu() {
  // ไม่ต้องรับ props แล้ว!
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <p>สวัสดี {user.name}</p>
      <button onClick={() => setUser({ name: 'ใหม่' })}>
        เปลี่ยนชื่อ
      </button>
    </div>
  );
}
```

## Pattern ที่ใช้บ่อย — Custom Provider Hook

แทนที่จะให้ทุกที่ใช้ `useContext(UserContext)` ตรงๆ เราจะสร้าง **Custom Hook** ห่อ:

```jsx
// UserContext.jsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
```

ใช้งาน:

```jsx
// App.jsx
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

// AnyPage.jsx
import { useUser } from './UserContext';

function ProfileButton() {
  const { user, logout } = useUser();
  return user ? <button onClick={logout}>ออกจากระบบ</button> : null;
}
```

## Theme Context — ตัวอย่างคลาสสิก

```jsx
// ThemeContext.jsx
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ?? 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// ThemeToggle.jsx
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## ลองเล่นเอง: Cart System

```jsx live
{
  "files": {
    "/App.jsx": "import { createRoot } from 'react-dom/client';\nimport App from './AppInner.jsx';\n\ncreateRoot(document.getElementById('root')).render(<App />);",
    "/AppInner.jsx": "import { CartProvider } from './CartContext';\nimport { products } from './data';\nimport ProductList from './ProductList';\nimport Cart from './Cart';\n\nexport default function App() {\n  return (\n    <CartProvider>\n      <div className=\"min-h-screen bg-slate-100 p-8\">\n        <div className=\"max-w-5xl mx-auto\">\n          <header className=\"flex justify-between items-center mb-6\">\n            <h1 className=\"text-3xl font-bold\">🛒 Shop</h1>\n            <Cart />\n          </header>\n          <ProductList products={products} />\n        </div>\n      </div>\n    </CartProvider>\n  );\n}",
    "/CartContext.jsx": "import { createContext, useContext, useState, useMemo } from 'react';\n\nconst CartContext = createContext(null);\n\nexport function CartProvider({ children }) {\n  const [items, setItems] = useState([]);\n\n  const addItem = (product) => {\n    setItems(prev => {\n      const existing = prev.find(i => i.id === product.id);\n      if (existing) {\n        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);\n      }\n      return [...prev, { ...product, qty: 1 }];\n    });\n  };\n\n  const removeItem = (id) => {\n    setItems(prev => prev.filter(i => i.id !== id));\n  };\n\n  const updateQty = (id, qty) => {\n    if (qty <= 0) return removeItem(id);\n    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));\n  };\n\n  const totalItems = useMemo(\n    () => items.reduce((sum, i) => sum + i.qty, 0),\n    [items]\n  );\n  const totalPrice = useMemo(\n    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),\n    [items]\n  );\n\n  return (\n    <CartContext.Provider\n      value={{ items, addItem, removeItem, updateQty, totalItems, totalPrice }}\n    >\n      {children}\n    </CartContext.Provider>\n  );\n}\n\nexport function useCart() {\n  const ctx = useContext(CartContext);\n  if (!ctx) throw new Error('useCart must be used within CartProvider');\n  return ctx;\n}",
    "/data.js": "export const products = [\n  { id: 1, name: 'หูฟัง Bluetooth', price: 1290, emoji: '🎧' },\n  { id: 2, name: 'คีย์บอร์ด Mechanical', price: 3490, emoji: '⌨️' },\n  { id: 3, name: 'เมาส์ไร้สาย', price: 890, emoji: '🖱️' },\n  { id: 4, name: 'จอภาพ 4K', price: 8990, emoji: '🖥️' },\n];",
    "/ProductList.jsx": "import { useCart } from './CartContext';\n\nexport default function ProductList({ products }) {\n  const { addItem } = useCart();\n\n  return (\n    <div className=\"grid sm:grid-cols-2 lg:grid-cols-4 gap-4\">\n      {products.map(p => (\n        <div key={p.id} className=\"bg-white rounded-xl shadow-md p-5\">\n          <div className=\"text-5xl mb-3\">{p.emoji}</div>\n          <h3 className=\"font-bold mb-2\">{p.name}</h3>\n          <p className=\"text-blue-600 font-bold text-lg mb-3\">\n            ฿{p.price.toLocaleString()}\n          </p>\n          <button\n            onClick={() => addItem(p)}\n            className=\"w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm\"\n          >\n            เพิ่มลงตะกร้า\n          </button>\n        </div>\n      ))}\n    </div>\n  );\n}",
    "/Cart.jsx": "import { useState } from 'react';\nimport { useCart } from './CartContext';\n\nexport default function Cart() {\n  const [open, setOpen] = useState(false);\n  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();\n\n  return (\n    <div className=\"relative\">\n      <button\n        onClick={() => setOpen(o => !o)}\n        className=\"relative px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow\"\n      >\n        🛒 ตะกร้า\n        {totalItems > 0 && (\n          <span className=\"absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold\">\n            {totalItems}\n          </span>\n        )}\n      </button>\n\n      {open && (\n        <div className=\"absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border p-4 z-10\">\n          {items.length === 0 ? (\n            <p className=\"text-center text-slate-500 py-4\">ตะกร้าว่างเปล่า</p>\n          ) : (\n            <>\n              <ul className=\"space-y-2 mb-3 max-h-60 overflow-auto\">\n                {items.map(item => (\n                  <li key={item.id} className=\"flex items-center gap-2 p-2 bg-slate-50 rounded\">\n                    <span className=\"text-2xl\">{item.emoji}</span>\n                    <div className=\"flex-1 min-w-0\">\n                      <div className=\"text-sm font-medium truncate\">{item.name}</div>\n                      <div className=\"text-xs text-slate-500\">\n                        ฿{item.price.toLocaleString()} × {item.qty}\n                      </div>\n                    </div>\n                    <input\n                      type=\"number\"\n                      value={item.qty}\n                      onChange={e => updateQty(item.id, +e.target.value)}\n                      className=\"w-12 border rounded px-1 text-sm\"\n                      min=\"1\"\n                    />\n                    <button\n                      onClick={() => removeItem(item.id)}\n                      className=\"text-red-500 text-sm\"\n                    >✕</button>\n                  </li>\n                ))}\n              </ul>\n              <div className=\"pt-3 border-t flex justify-between font-bold\">\n                <span>รวม</span>\n                <span className=\"text-blue-600\">฿{totalPrice.toLocaleString()}</span>\n              </div>\n            </>\n          )}\n        </div>\n      )}\n    </div>\n  );\n}",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม **AuthContext** แยก (login/logout/user)
- เพิ่ม **ToastContext** สำหรับแจ้งเตือน "เพิ่มสินค้าแล้ว"
- รวมหลาย Provider ด้วย helper hook หรือใช้ library เช่น `use-context-selector`

## Context vs Redux

| | Context API | Redux |
|---|---|---|
| **ขนาด** | มากับ React | ต้องติดตั้งเพิ่ม |
| **ใช้กับ** | State ไม่ซับซ้อน | State ใหญ่/ซับซ้อน |
| **Performance** | Re-render ทุก consumer | มี selector ลด re-render |
| **Devtools** | ไม่มี | Redux DevTools ดีมาก |

> 💡 **แนวทาง**: เริ่มจาก Context ก่อน ถ้า state เริ่มซับซ้อนค่อยขยับไป Redux/Zustand

## สรุป

- **Context API** แก้ปัญหา Prop Drilling
- 3 ขั้นตอน: `createContext` → `<Provider>` → `useContext`
- **Custom Hook pattern** (`useUser`, `useCart`) ช่วยให้ใช้งานง่ายและปลอดภัย
- เหมาะกับ Theme, Auth, Cart, i18n — state ที่หลาย component ต้องเข้าถึง
- ในโปรเจกต์ใหญ่ พิจารณา **Redux/Zustand** หรือ **use-context-selector**

---

ถัดไป: **MERN Architecture** — ภาพรวมการเชื่อมต่อทั้งระบบ 🏗️