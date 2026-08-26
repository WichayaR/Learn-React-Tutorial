# บทที่ 1: ภาพรวม React & MERN

## React คืออะไร

**React** คือไลบรารี JavaScript สำหรับสร้าง User Interface (UI) ที่พัฒนาโดย Facebook (Meta) เปิดตัวครั้งแรกปี 2013 ปัจจุบันเป็นหนึ่งในเครื่องมือที่ได้รับความนิยมสูงสุดในโลกของ Web Development

จุดเด่นของ React:

- **Component-based**: แยก UI เป็นชิ้นเล็กๆ ที่นำกลับมาใช้ซ้ำได้
- **Declarative**: บอกว่า "อยากให้ UI ออกมาเป็นยังไง" ไม่ต้องบอก "ทำยังไง"
- **Virtual DOM**: อัปเดต UI อย่างมีประสิทธิภาพ

> 💡 **Our North Star**: ทีมพัฒนา React มุ่งเน้นทำให้การสร้าง "User Experience ที่ดีเยี่ยม" เป็นเรื่องง่าย

## MERN Stack คืออะไร

MERN คือ Full-stack JavaScript ที่ประกอบด้วย 4 เทคโนโลยี:

| ตัวอักษร | เทคโนโลยี | บทบาท |
|---------|-----------|--------|
| **M** | **M**ongoDB | Database (เก็บข้อมูล) |
| **E** | **E**xpress.js | Backend Framework |
| **R** | **R**eact | Frontend (UI) |
| **N** | **N**ode.js | Runtime สำหรับ Server |

### การทำงานของ MERN

```
┌──────────┐    HTTP Request    ┌──────────┐   Data Request   ┌──────────┐
│  Client  │ ─────────────────▶ │  Server  │ ───────────────▶ │ Database │
│  (React) │ ◀───────────────── │ (Node.js)│ ◀─────────────── │ (Mongo)  │
└──────────┘    HTTP Response   └──────────┘   Data Response  └──────────┘
```

1. **Client (React)**: ส่ง HTTP Request เพื่อขอข้อมูล
2. **Server (Node + Express)**: ประมวลผลลอจิก ส่งต่อคำขอไปยัง Database
3. **Database (MongoDB)**: ค้นหา/บันทึกข้อมูล ส่งผลลัพธ์กลับ
4. **Response กลับมา**: ข้อมูลวิ่งกลับมาที่ Client เพื่อแสดงผล

## Mental Model: มอง UI เป็นต้นไม้

ใน React เราจะมอง UI เป็น **Component Tree**:

```
<App>
 ├─ <Header>
 ├─ <Sidebar>
 └─ <MainContent>
     ├─ <ArticleCard>
     │   ├─ <Thumbnail>
     │   └─ <Title>
     └─ <ArticleList>
         ├─ <Item> × N
```

แต่ละ Component คือ "ตัวต่อ" ชิ้นหนึ่ง ที่ประกอบเข้าด้วยกันเป็น UI ทั้งหน้า

## Virtual DOM & Rendering Process

เมื่อ State เปลี่ยน React จะทำงานตามขั้นตอนนี้:

1. **Trigger**: มีบางอย่างเปลี่ยน (เช่น `setState`, ผู้ใช้คลิก, ข้อมูลจาก API)
2. **Render**: React คำนวณว่า UI ใหม่ควรหน้าตาเป็นยังไง (สร้าง Virtual DOM ใหม่)
3. **Commit**: React เปรียบเทียบ Virtual DOM ใหม่กับของเดิม (เรียกว่า **Diffing/Reconciliation**) แล้วอัปเดตเฉพาะส่วนที่เปลี่ยน
4. **Browser Paint**: Browser วาดหน้าจอใหม่

> 🎯 เหตุผลที่ใช้ Virtual DOM: แทนที่จะอัปเดต DOM จริงทั้งหมด (ช้า) React จะอัปเดตเฉพาะส่วนที่ต่าง (เร็ว)

## สรุป

- React คือ **ไลบรารี** สำหรับสร้าง UI แบบ Component-based
- MERN Stack ประกอบด้วย MongoDB, Express, React, Node.js
- UI ใน React ถูกมองเป็น **ต้นไม้** ของ Components
- React ใช้ **Virtual DOM** + Diffing algorithm เพื่ออัปเดต UI อย่างมีประสิทธิภาพ
- 4 ขั้นตอนการ Render: **Trigger → Render → Commit → Browser Paint**

---

พร้อมเรียนเรื่อง JSX และ Components ในบทถัดไปแล้ว! 🎉