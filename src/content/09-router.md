# บทที่ 9: React Router

## Single Page Application (SPA)

**SPA** คือเว็บที่เปลี่ยนหน้าโดย **ไม่ reload browser ทั้งหน้า** — JavaScript จัดการแค่เปลี่ยน "view" ที่แสดง

ข้อดี:
- เร็ว (ไม่ต้องโหลด HTML ซ้ำ)
- UX ลื่นไหล
- สถานะ (state) คงอยู่ข้ามหน้า

## ติดตั้ง

```bash
npm install react-router-dom
```

## โครงสร้างพื้นฐาน

```jsx
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '*', element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

## การนำทาง — 2 วิธี

### 1. `<Link>` — สำหรับ link ทั่วไป

```jsx
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <Link to="/">หน้าแรก</Link>
      <Link to="/about">เกี่ยวกับ</Link>
      <Link to="/products/1">สินค้า #1</Link>
    </nav>
  );
}
```

### 2. `useNavigate()` — สำหรับ navigate แบบ programmatic

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard');  // redirect หลัง login
  };

  return <button onClick={handleLogin}>เข้าสู่ระบบ</button>;
}
```

## Dynamic Routes

```jsx
const router = createBrowserRouter([
  { path: '/products/:productId', element: <ProductDetail /> },
]);

import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { productId } = useParams();
  return <h1>สินค้า #{productId}</h1>;
}
```

URL `/products/42` → `productId === "42"`

## Nested Routes + `<Outlet>`

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />  {/* render child route ตรงนี้ */}
      </main>
      <Footer />
    </div>
  );
}
```

## Error Element (404 page)

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,  // จับทุก error ของ children
    children: [
      { path: 'products/:productId', element: <ProductDetail /> },
    ],
  },
]);

import { useRouteError, Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <h1>404 - ไม่พบหน้านี้</h1>
      <Link to="/">กลับหน้าแรก</Link>
    </div>
  );
}
```

## NavLink — ไฮไลท์ active link

```jsx
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav className="flex gap-2">
      {[
        { to: '/', label: 'หน้าแรก' },
        { to: '/about', label: 'เกี่ยวกับ' },
      ].map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
```

## Protected Route (ตัวอย่างขั้นสูง)

```jsx
function RequireAuth({ children }) {
  const user = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ใช้
{
  path: '/dashboard',
  element: (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
}
```

## ลองเล่นเอง: Mini Blog

```jsx live
{
  "files": {
    "/App.jsx": "import { createBrowserRouter, RouterProvider } from 'react-router-dom';\n\nconst router = createBrowserRouter([\n  {\n    path: '/',\n    element: <Layout />,\n    errorElement: <ErrorPage />,\n    children: [\n      { index: true, element: <Home /> },\n      { path: 'about', element: <About /> },\n      { path: 'post/:postId', element: <PostDetail /> },\n    ],\n  },\n]);\n\nexport default function App() {\n  return <RouterProvider router={router} />;\n}\n\n// ========= Components =========\n\nimport { Outlet, NavLink, Link, useParams, useRouteError } from 'react-router-dom';\n\nfunction Layout() {\n  return (\n    <div className=\"min-h-screen bg-slate-50\">\n      <nav className=\"bg-white border-b px-6 py-3 flex gap-4 items-center\">\n        <Link to=\"/\" className=\"font-bold text-xl\">📚 Blog</Link>\n        <NavLink\n          to=\"/\"\n          end\n          className={({ isActive }) =>\n            `px-3 py-1 rounded ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`\n          }\n        >\n          หน้าแรก\n        </NavLink>\n        <NavLink\n          to=\"/about\"\n          className={({ isActive }) =>\n            `px-3 py-1 rounded ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`\n          }\n        >\n          เกี่ยวกับ\n        </NavLink>\n      </nav>\n      <main className=\"max-w-2xl mx-auto p-6\">\n        <Outlet />\n      </main>\n    </div>\n  );\n}\n\nfunction Home() {\n  const posts = [\n    { id: 1, title: 'เริ่มต้นกับ React', excerpt: 'บทนำสำหรับผู้เริ่มต้น' },\n    { id: 2, title: 'เข้าใจ useState และ useEffect', excerpt: 'Hooks พื้นฐาน' },\n    { id: 3, title: 'React Router คืออะไร', excerpt: 'SPA navigation' },\n  ];\n  return (\n    <div>\n      <h1 className=\"text-3xl font-bold mb-6\">โพสต์ล่าสุด</h1>\n      <div className=\"space-y-3\">\n        {posts.map(p => (\n          <Link\n            key={p.id}\n            to={`/post/${p.id}`}\n            className=\"block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border border-slate-200\"\n          >\n            <h2 className=\"font-bold text-lg mb-1\">{p.title}</h2>\n            <p className=\"text-slate-600 text-sm\">{p.excerpt}</p>\n          </Link>\n        ))}\n      </div>\n    </div>\n  );\n}\n\nfunction About() {\n  return (\n    <div>\n      <h1 className=\"text-3xl font-bold mb-3\">เกี่ยวกับ</h1>\n      <p className=\"text-slate-600\">เว็บ Blog สาธิตการใช้งาน React Router</p>\n    </div>\n  );\n}\n\nfunction PostDetail() {\n  const { postId } = useParams();\n  const posts = {\n    '1': { title: 'เริ่มต้นกับ React', content: '...' },\n    '2': { title: 'useState & useEffect', content: '...' },\n    '3': { title: 'React Router', content: '...' },\n  };\n  const post = posts[postId];\n\n  if (!post) {\n    return <ErrorPage />;\n  }\n\n  return (\n    <article className=\"bg-white p-6 rounded-xl shadow-sm border border-slate-200\">\n      <h1 className=\"text-3xl font-bold mb-3\">{post.title}</h1>\n      <p className=\"text-slate-600 mb-4\">โพสต์ #{postId}</p>\n      <p>นี่คือเนื้อหาตัวอย่าง (ในแอปจริงจะ fetch จาก API)</p>\n      <Link to=\"/\" className=\"inline-block mt-4 text-blue-600 hover:underline\">\n        ← กลับหน้าแรก\n      </Link>\n    </article>\n  );\n}\n\nfunction ErrorPage() {\n  const error = useRouteError();\n  return (\n    <div className=\"text-center py-12\">\n      <h1 className=\"text-6xl font-extrabold text-slate-300 mb-2\">404</h1>\n      <h2 className=\"text-2xl font-bold mb-3\">ไม่พบหน้า</h2>\n      <p className=\"text-slate-600 mb-6\">\n        {error?.statusText || error?.message || 'เกิดข้อผิดพลาด'}\n      </p>\n      <Link to=\"/\" className=\"px-4 py-2 bg-blue-500 text-white rounded-lg\">\n        กลับหน้าแรก\n      </Link>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- ลองคลิกโพสต์ #1, #2, #3 แล้วสังเกต URL
- ลองพิมพ์ `/post/999` ใน URL → เห็น 404
- เพิ่ม nested route เช่น `/about/team`
- ลองพิมพ์ URL ที่ไม่มี → เห็น errorElement

## สรุป

- **SPA** เปลี่ยนหน้าโดยไม่ reload — ใช้ React Router จัดการ
- `createBrowserRouter` + `<RouterProvider>` ประกาศ routes
- `<Link>` / `useNavigate()` สำหรับ navigate
- **Dynamic routes**: `:productId` + `useParams()`
- **Nested routes**: `<Outlet>` ใน parent
- `errorElement` จับ error / 404

---

ถัดไป: **Context API** — แชร์ State โดยไม่ต้องส่ง Props ทอด 🌐