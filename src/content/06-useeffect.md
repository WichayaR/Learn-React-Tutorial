# บทที่ 6: useEffect Hook

## useEffect คืออะไร

**useEffect** คือ Hook สำหรับรัน **Side Effect** หลังจาก Component render เสร็จ เช่น:

- ดึงข้อมูลจาก API
- ตั้ง/ล้าง timer (setInterval, setTimeout)
- Subscribe event (WebSocket, IntersectionObserver)
- แก้ไข DOM โดยตรง (เช่น document.title)

```jsx
import { useEffect } from 'react';

function PageTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `นับ ${count} ครั้ง`;
  });  // รันทุกครั้งหลัง render

  return <button onClick={() => setCount(c => c + 1)}>+1</button>;
}
```

## โครงสร้าง useEffect

```jsx
useEffect(() => {
  // 🟢 Effect — รันหลัง render
  doSomething();

  return () => {
    // 🟡 Cleanup — รันก่อน effect รอบถัดไป หรือตอน unmount
    cleanup();
  };
}, [dep1, dep2]);  // 🔵 Dependency Array
```

## Dependency Array — หัวใจของ useEffect

### ไม่มี dependency array — รันทุกครั้งหลัง render

```jsx
useEffect(() => {
  console.log('รันทุกครั้ง');
});
```

⚠️ **ระวัง**: มักจะทำให้ infinite loop ถ้า effect อัปเดต state

### `[]` — รันครั้งเดียวตอน mount

```jsx
useEffect(() => {
  fetchInitialData();
}, []);  // เหมาะกับ API call ครั้งแรก
```

### `[dep]` — รันเมื่อ dep เปลี่ยน

```jsx
useEffect(() => {
  fetchUserById(userId);
}, [userId]);  // รันใหม่เมื่อ userId เปลี่ยน
```

### กฎเหล็ก: ทุกอย่างที่ใช้ใน effect ต้องอยู่ใน dependency

```jsx
// ❌ Bug — ขาด dep
function Search({ query }) {
  const [results, setResults] = useState([]);
  useEffect(() => {
    searchAPI(query).then(setResults);
  }, []);  // ควรใส่ [query]
}

// ✅ ถูก
useEffect(() => {
  searchAPI(query).then(setResults);
}, [query]);
```

ถ้าใช้ ESLint plugin (`eslint-plugin-react-hooks`) มันจะเตือนให้อัตโนมัติ

## Cleanup Function

ใช้ "เก็บกวาด" ทุกอย่างที่ effect สร้างขึ้น:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(id);  // หยุดเมื่อ unmount
}, []);
```

ตัวอย่างอื่นๆ:

```jsx
// Subscribe event
useEffect(() => {
  const handler = (e) => console.log(e);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// AbortController สำหรับ fetch
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => {
      if (e.name !== 'AbortError') console.error(e);
    });
  return () => controller.abort();
}, [id]);
```

## ตัวอย่าง: ดึงข้อมูลจาก API

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>ผิดพลาด: {error}</p>;

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

## ลองเล่นเอง: Live Search

```jsx live
{
  "files": {
    "/App.jsx": "import { useState, useEffect } from 'react';\n\nexport default function App() {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState([]);\n  const [loading, setLoading] = useState(false);\n\n  // ดีบัก input 500ms ก่อนค้นหา (debounce)\n  useEffect(() => {\n    if (!query.trim()) {\n      setResults([]);\n      return;\n    }\n\n    const controller = new AbortController();\n    setLoading(true);\n\n    const timer = setTimeout(async () => {\n      try {\n        const res = await fetch(\n          `https://jsonplaceholder.typicode.com/users?name_like=${query}`,\n          { signal: controller.signal }\n        );\n        const data = await res.json();\n        setResults(data);\n      } catch (e) {\n        if (e.name !== 'AbortError') console.error(e);\n      } finally {\n        setLoading(false);\n      }\n    }, 500);\n\n    return () => {\n      controller.abort();\n      clearTimeout(timer);\n    };\n  }, [query]);\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-md mx-auto bg-white rounded-xl shadow-md p-6\">\n        <h1 className=\"text-2xl font-bold mb-4\">🔍 Live Search</h1>\n        <input\n          value={query}\n          onChange={e => setQuery(e.target.value)}\n          className=\"w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:border-blue-500 outline-none\"\n          placeholder=\"พิมพ์ชื่อผู้ใช้...\"\n        />\n\n        {loading && (\n          <p className=\"text-sm text-slate-500\">กำลังค้นหา...</p>\n        )}\n\n        <ul className=\"space-y-2\">\n          {results.map(user => (\n            <li key={user.id} className=\"p-3 bg-slate-50 rounded-lg\">\n              <div className=\"font-medium\">{user.name}</div>\n              <div className=\"text-sm text-slate-500\">{user.email}</div>\n            </li>\n          ))}\n          {!loading && query && results.length === 0 && (\n            <li className=\"text-sm text-slate-500 text-center py-4\">\n              ไม่พบผลลัพธ์\n            </li>\n          )}\n        </ul>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- ลบ `setTimeout` ออก ดูว่าทุก keystroke ยิง request กี่ครั้ง
- เพิ่ม min length (เช่น 3 ตัวอักษร) ก่อนค้นหา
- เพิ่ม effect ที่ set `document.title` เป็น `"ผลลัพธ์: ${results.length} รายการ"`

## สรุป

- **useEffect** รัน Side Effect หลัง render
- **Dependency Array** ควบคุมว่า effect รันเมื่อไหร่
  - ไม่มี → ทุกครั้ง
  - `[]` → ครั้งเดียวตอน mount
  - `[dep]` → เมื่อ dep เปลี่ยน
- **Cleanup function** ทำลายสิ่งที่ effect สร้างไว้ (timer, listener, request)
- ทุก reactive value ที่ใช้ใน effect ต้องอยู่ใน dependency array
- ใช้ `AbortController` สำหรับ fetch เพื่อยกเลิก request เก่า

---

ถัดไป: **Event Handling** — ดักจับการโต้ตอบกับผู้ใช้ 🖱️