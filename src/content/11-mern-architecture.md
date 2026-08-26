# บทที่ 11: MERN Architecture

## ภาพรวมระบบ MERN

```
┌──────────────────────────────────────────────────────────┐
│                         CLIENT                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  React App (Browser)                               │  │
│  │  • Components                                      │  │
│  │  • Hooks (useState, useEffect, useContext)         │  │
│  │  • Router                                          │  │
│  │  • Tailwind CSS                                    │  │
│  └────────────────────────────────────────────────────┘  │
│         │                                                 │
│         │ HTTP Request (fetch / axios)                     │
│         │ JSON payload                                    │
└─────────┼─────────────────────────────────────────────────┘
          ▼
┌──────────────────────────────────────────────────────────┐
│                         SERVER                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Node.js + Express.js                              │  │
│  │                                                    │  │
│  │  • Routes:    GET /api/posts, POST /api/posts      │  │
│  │  • Middleware: auth, validation, cors, logging     │  │
│  │  • Controllers: business logic                     │  │
│  └────────────────────────────────────────────────────┘  │
│         │                                                 │
│         │ Mongoose / MongoDB Driver                       │
│         │ Data Request                                    │
└─────────┼─────────────────────────────────────────────────┘
          ▼
┌──────────────────────────────────────────────────────────┐
│                        DATABASE                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  MongoDB                                           │  │
│  │                                                    │  │
│  │  • Collections (เหมือน table)                      │  │
│  │  • Documents (เหมือน row)                        │  │
│  │  • Flexible schema (NoSQL)                         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Request/Response Cycle (ตัวอย่างจริง)

ผู้ใช้กดปุ่ม "โหลด Posts":

```
1. Browser                          Server                  Database
   │                                   │                       │
   │  fetch('/api/posts')              │                       │
   ├──────────────────────────────────▶│                       │
   │                                   │  db.posts.find()      │
   │                                   ├──────────────────────▶│
   │                                   │                       │
   │                                   │◀──────────────────────┤
   │                                   │  [doc1, doc2, doc3]   │
   │                                   │                       │
   │◀──────────────────────────────────┤                       │
   │  200 OK + JSON                    │                       │
   │                                   │                       │
   │ setState(data) → re-render        │                       │
```

## Layer ของ MERN

### 1. Client Layer (React)

สิ่งที่เราเรียนมาทั้งหมด:

- **Components** + **JSX**
- **Hooks**: useState, useEffect, useContext
- **Router**: SPA navigation
- **State management**: Context API
- **HTTP**: fetch / axios

### 2. Server Layer (Node + Express)

```js
// server.js (Node + Express)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Model
const Post = mongoose.model('Post', {
  title: String,
  body: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

// Routes
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
});

app.listen(3000, () => console.log('Server on :3000'));
```

### 3. Database Layer (MongoDB)

```js
// เก็บเป็น document (JSON-like)
{
  _id: ObjectId('...'),
  title: 'เริ่มต้นกับ React',
  body: '...',
  author: 'สมชาย',
  createdAt: ISODate('2024-01-15T...')
}
```

## REST API Conventions

| Method | URL | ใช้ทำอะไร |
|--------|-----|-----------|
| `GET` | `/api/posts` | ดึงรายการ posts ทั้งหมด |
| `GET` | `/api/posts/:id` | ดึง post เดียว |
| `POST` | `/api/posts` | สร้าง post ใหม่ |
| `PUT` | `/api/posts/:id` | แก้ไข post ทั้งหมด |
| `PATCH` | `/api/posts/:id` | แก้ไขบาง field |
| `DELETE` | `/api/posts/:id` | ลบ post |

## CORS — ทำไมต้องมี?

เว็บ React รันที่ `localhost:5173` แต่ API อยู่ที่ `localhost:3000` Browser จะบล็อค request ข้าม port โดย default ต้องเปิด **CORS** ที่ Server

```js
// Server
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173',  // อนุญาตเฉพาะ dev
  credentials: true,
}));
```

หรือใช้ **Vite Proxy** ใน dev:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // /api/* → backend
    },
  },
});
```

## Deployment Architecture

```
Production:
┌──────────────────┐
│  Vercel/Netlify  │    Static files (HTML, CSS, JS)
│  React App       │    → CDN ทั่วโลก เร็วมาก
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────┐
│  Render/Railway  │    Node.js + Express
│  API Server      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  MongoDB Atlas   │    Database as a Service
│  (Cloud)         │    ฟรี tier เริ่มต้น
└──────────────────┘
```

## เครื่องมือที่ใช้ใน Production

| Layer | เครื่องมือแนะนำ |
|-------|-----------------|
| Frontend | Vite, React, TypeScript (optional) |
| State | Context API / Zustand / Redux Toolkit |
| Data fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS / shadcn/ui |
| Backend | Node.js, Express, Fastify |
| Database | MongoDB + Mongoose |
| Auth | JWT / NextAuth / Clerk |
| Testing | Vitest, React Testing Library, Playwright |
| Deploy | Vercel (frontend), Render (backend), Atlas (DB) |

## Full-Stack Best Practices

1. **แยก concerns**: Frontend ≠ Backend — deploy แยกกันได้
2. **Environment variables**: ใช้ `.env` สำหรับ URL, keys
3. **Error handling**: ทั้ง client และ server ต้อง handle error
4. **Loading states**: UX ที่ดีต้องบอกผู้ใช้ว่ากำลังโหลด
5. **Type safety** (optional): TypeScript, Zod schema ทั้ง front/back
6. **Testing**: Component test + Integration test + E2E

## สรุปทั้งหลักสูตร

ตลอด 11 บทเราได้เรียนรู้:

✅ **พื้นฐาน**: React, MERN, JSX, Components
✅ **Tailwind CSS**: utility-first styling
✅ **Data Flow**: Props, useState, useEffect
✅ **Events**: ดักจับ event และ form
✅ **Network**: fetch + async/await + AbortController
✅ **Routing**: SPA ด้วย React Router
✅ **State ส่วนกลาง**: Context API
✅ **Architecture**: MERN full-stack

## Next Steps สำหรับผู้เรียน

1. **ฝึกเขียนโปรเจกต์**: Todo App, Blog, E-commerce (เล็กๆ)
2. **เรียนเพิ่ม**:
   - TypeScript
   - TanStack Query / SWR
   - React Hook Form + Zod
   - Testing (Vitest, Playwright)
3. **สร้าง Backend**: Node + Express + MongoDB จริงๆ
4. **Deploy**: Vercel + Render + MongoDB Atlas
5. **อ่านเพิ่ม**: [React Docs](https://react.dev), [Patterns](https://reactpatterns.com)

---

## 🎉 จบหลักสูตรแล้ว!

ขอให้สนุกกับการเขียน React และสร้าง Web Application ที่ยอดเยี่ยมครับ! 🚀

ถ้ามีคำถามหรืออยากเรียนเรื่องอะไรเพิ่ม สามารถกลับมาอ่านบทต่างๆ ซ้ำได้ตลอด