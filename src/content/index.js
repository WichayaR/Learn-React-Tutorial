// เมตาดาต้าบทเรียน — เพิ่มบทใหม่ได้ที่นี่ แล้วสร้างไฟล์ .md ที่ src/content/
export const lessons = [
  {
    slug: 'overview',
    title: 'ภาพรวม React & MERN',
    description: 'ทำความรู้จัก React, MERN Stack และวงจรการ Render UI',
    duration: '8 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'jsx-components',
    title: 'JSX & Components',
    description: 'ไวยากรณ์ JSX และการแยก Component ออกเป็นไฟล์',
    duration: '12 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'project-structure',
    title: 'โครงสร้างโปรเจกต์ React',
    description: 'Vite starter, โครงสร้างไฟล์ components/pages/context/services',
    duration: '10 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'tailwind-intro',
    title: 'แนะนำ Tailwind CSS',
    description: 'ใช้ utility classes ตกแต่ง UI แทนการเขียน CSS แบบเดิม',
    duration: '10 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'mental-model',
    title: 'React Mental Model',
    description: 'เปลี่ยนวิธีคิดจาก imperative เป็น declarative + Hooks คืออะไร',
    duration: '10 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'render-list',
    title: 'Render List & Conditional',
    description: 'ใช้ .map(), key, ternary และ && ในการแสดงผลแบบมีเงื่อนไข',
    duration: '12 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'props',
    title: 'Props',
    description: 'ส่งข้อมูลจาก Parent Component ไปยัง Child Component',
    duration: '10 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'event-handling',
    title: 'Event Handling',
    description: 'ดักจับ Event และจัดการการโต้ตอบกับผู้ใช้',
    duration: '8 นาที',
    level: 'เริ่มต้น',
  },
  {
    slug: 'usestate',
    title: 'useState Hook',
    description: 'สร้างตัวแปรที่ทำให้ React re-render เมื่อค่าเปลี่ยน',
    duration: '15 นาที',
    level: 'กลาง',
  },
  {
    slug: 'forms',
    title: 'Form & Controlled Components',
    description: 'จัดการ Form, Input, onSubmit และ preventDefault',
    duration: '12 นาที',
    level: 'กลาง',
  },
  {
    slug: 'useeffect',
    title: 'useEffect Hook',
    description: 'จัดการ Side Effects และ Dependency Array',
    duration: '18 นาที',
    level: 'กลาง',
  },
  {
    slug: 'api-integration',
    title: 'API Integration',
    description: 'เชื่อมต่อ HTTP Request/Response กับ Backend',
    duration: '15 นาที',
    level: 'กลาง',
  },
  {
    slug: 'router',
    title: 'React Router',
    description: 'Single Page Application, Dynamic Route และ 404',
    duration: '20 นาที',
    level: 'กลาง',
  },
  {
    slug: 'context',
    title: 'Context API',
    description: 'แชร์ State ข้าม Component โดยไม่ต้องส่ง Props ทอด',
    duration: '15 นาที',
    level: 'กลาง',
  },
  {
    slug: 'lifting-state',
    title: 'Lifting State & Best Practices',
    description: 'ย้าย State ขึ้น Parent, Derived Data, 4 UI States, .env, สิ่งที่ควรเลิกทำ',
    duration: '15 นาที',
    level: 'กลาง',
  },
  {
    slug: 'mern-architecture',
    title: 'MERN Architecture',
    description: 'ภาพรวมการทำงานระหว่าง Client, Server และ Database',
    duration: '10 นาที',
    level: 'สรุป',
  },
];

export function getLessonBySlug(slug) {
  return lessons.find((l) => l.slug === slug);
}

export function getAdjacentLessons(slug) {
  const idx = lessons.findIndex((l) => l.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : null,
  };
}

// โหลด markdown ทุกบทด้วย Vite glob (eager) — bundle ครั้งเดียวตอน build ไม่พลาด runtime
const markdownModules = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// สร้าง slug → file key mapping ตอน module load (เร็วและ deterministic)
// แทนการเดา prefix จาก index ที่อาจผิดพลาด
const slugToFileKey = (() => {
  const map = {};
  for (const key of Object.keys(markdownModules)) {
    // key = "./01-overview.md" → "01-overview"
    const filename = key.replace(/^\.\//, '').replace(/\.md$/, '');
    // ลอง match กับ slug ของทุก lesson
    for (const lesson of lessons) {
      // รูปแบบ: "01-overview" หรือ "overview" → ตรงกับ slug "overview"
      if (filename === lesson.slug || filename.endsWith(`-${lesson.slug}`)) {
        map[lesson.slug] = key;
        break;
      }
    }
  }
  return map;
})();

export async function loadLessonMarkdown(slug) {
  // รอ microtask เพื่อให้ loading state แสดงผล
  await Promise.resolve();
  return slugToFileKey[slug] ? markdownModules[slugToFileKey[slug]] : null;
}