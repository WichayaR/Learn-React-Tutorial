# บทที่ 8: API Integration

## HTTP Request/Response

ใน MERN Stack, **React (Client)** สื่อสารกับ **Server** ผ่าน HTTP:

```
Client                              Server
  │                                    │
  │──GET /api/posts──▶                 │
  │                                    │── ประมวลผล ──▶ Database
  │                                    │◀── ผลลัพธ์ ──
  │◀──200 OK + JSON──                  │
```

## fetch API — พื้นฐาน

```jsx
fetch('/api/posts')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Async/Await (แนะนำ — อ่านง่ายกว่า)

```jsx
async function loadPosts() {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

## HTTP Methods

```jsx
// GET — อ่านข้อมูล
fetch('/api/users')

// POST — สร้างใหม่
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'สมชาย', email: 'test@test.com' }),
})

// PUT/PATCH — แก้ไข
fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'ใหม่' }),
})

// DELETE — ลบ
fetch('/api/users/1', { method: 'DELETE' })
```

## Loading & Error State Pattern

```jsx
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`ผิดพลาด ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <PostList posts={posts} />;
}
```

## POST Data Pattern

```jsx
function NewPostForm() {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          userId: 1,
        }),
      });
      const created = await res.json();
      console.log('สร้างสำเร็จ:', created);
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button disabled={submitting}>
        {submitting ? 'กำลังส่ง...' : 'โพสต์'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

## ลองเล่นเอง: Posts CRUD

```jsx live
{
  "files": {
    "/App.jsx": "import { useState, useEffect } from 'react';\n\nconst API = 'https://jsonplaceholder.typicode.com/posts';\n\nexport default function App() {\n  const [posts, setPosts] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  const [title, setTitle] = useState('');\n  const [submitting, setSubmitting] = useState(false);\n\n  // โหลด posts\n  useEffect(() => {\n    const controller = new AbortController();\n    (async () => {\n      try {\n        setLoading(true);\n        const res = await fetch(`${API}?_limit=5`, { signal: controller.signal });\n        if (!res.ok) throw new Error(`HTTP ${res.status}`);\n        setPosts(await res.json());\n      } catch (err) {\n        if (err.name !== 'AbortError') setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    })();\n    return () => controller.abort();\n  }, []);\n\n  // เพิ่ม post\n  const addPost = async (e) => {\n    e.preventDefault();\n    if (!title.trim()) return;\n    setSubmitting(true);\n    try {\n      const res = await fetch(API, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ title, userId: 1 }),\n      });\n      const newPost = await res.json();\n      setPosts(prev => [{ ...newPost, id: Date.now() }, ...prev]);\n      setTitle('');\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setSubmitting(false);\n    }\n  };\n\n  // ลบ post\n  const deletePost = async (id) => {\n    try {\n      await fetch(`${API}/${id}`, { method: 'DELETE' });\n      setPosts(prev => prev.filter(p => p.id !== id));\n    } catch (err) {\n      setError(err.message);\n    }\n  };\n\n  if (loading) return (\n    <div className=\"min-h-screen flex items-center justify-center\">\n      <div className=\"animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full\" />\n    </div>\n  );\n\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <div className=\"max-w-2xl mx-auto\">\n        <h1 className=\"text-3xl font-bold mb-6\">📰 Posts (CRUD)</h1>\n\n        <form onSubmit={addPost} className=\"bg-white rounded-xl shadow-md p-4 mb-6 flex gap-2\">\n          <input\n            value={title}\n            onChange={e => setTitle(e.target.value)}\n            placeholder=\"หัวข้อโพสต์ใหม่...\"\n            className=\"flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none\"\n            disabled={submitting}\n          />\n          <button\n            type=\"submit\"\n            disabled={submitting}\n            className=\"px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium\"\n          >\n            {submitting ? '...' : 'เพิ่ม'}\n          </button>\n        </form>\n\n        {error && (\n          <div className=\"bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4\">\n            ❌ {error}\n          </div>\n        )}\n\n        <div className=\"space-y-3\">\n          {posts.map(post => (\n            <div key={post.id} className=\"bg-white rounded-xl shadow-md p-4 flex justify-between items-start gap-3\">\n              <div className=\"flex-1 min-w-0\">\n                <div className=\"text-xs text-slate-500 mb-1\">#{post.id}</div>\n                <p className=\"capitalize\">{post.title}</p>\n              </div>\n              <button\n                onClick={() => deletePost(post.id)}\n                className=\"text-red-500 hover:text-red-700 text-sm font-medium\"\n              >\n                ลบ\n              </button>\n            </div>\n          ))}\n        </div>\n      </div>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม edit (PUT) — คลิก "แก้ไข" แล้วเปลี่ยน title
- เพิ่ม loading skeleton แทน spinner
- เพิ่ม search/filter ด้วย query param (`?q=...`)

## สรุป

- **fetch** ใช้ติดต่อ Backend ผ่าน HTTP
- ใช้ **async/await** แทน `.then()` เพื่ออ่านง่าย
- Methods: `GET` (อ่าน), `POST` (สร้าง), `PUT/PATCH` (แก้), `DELETE` (ลบ)
- จัดการ **3 state**: `loading`, `error`, `data`
- ใช้ **AbortController** ยกเลิก request เมื่อ component unmount
- Production: ควรใช้ **axios** หรือ **TanStack Query** เพื่อ DX ที่ดีกว่า

---

ถัดไป: **React Router** — Single Page Application 🧭