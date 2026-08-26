# บทที่ 4: Props

## Props คืออะไร

**Props** (ย่อมาจาก "properties") คือกลไกที่ React ใช้ส่งข้อมูลจาก **Parent Component** ไปยัง **Child Component** ทำงานคล้าย **argument ของฟังก์ชัน**

```jsx
// Parent
function App() {
  return <Greeting name="สมชาย" age={25} />;
}

// Child — รับ props ผ่าน parameter
function Greeting(props) {
  return <h1>สวัสดี {props.name}, อายุ {props.age}</h1>;
}
```

## รูปแบบการเขียน Props

### 1. ผ่าน `props` object

```jsx
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
}
```

### 2. Destructuring (แนะนำ)

```jsx
function UserCard({ name, email, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
}
```

### 3. กำหนด default value

```jsx
function Button({ label = 'คลิก', variant = 'primary' }) {
  return <button className={`btn-${variant}`}>{label}</button>;
}

// <Button /> ใช้ default
// <Button label="บันทึก" variant="success" />  override ได้
```

## ส่ง Props ได้หลายชนิด

```jsx
function ProductCard() {
  const product = {
    id: 1,
    name: 'หูฟังไร้สาย',
    price: 1290,
    inStock: true,
    tags: ['audio', 'wireless', 'new'],
  };

  return (
    <Item
      title={product.name}              // string
      price={product.price}             // number
      available={product.inStock}       // boolean
      categories={product.tags}         // array
      onAddToCart={() => alert('เพิ่มแล้ว')}  // function
      config={{ theme: 'dark', lang: 'th' }}  // object
    />
  );
}
```

## Children Prop — เนื้อหาภายใน Component

เนื้อหาที่อยู่ระหว่าง opening/closing tag จะถูกส่งเป็น `children` prop อัตโนมัติ

```jsx
function Card({ children, title }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-bold mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// ใช้งาน
<Card title="คำเตือน">
  <p>อย่าลืมอ่านเอกสารก่อนเริ่มเรียน</p>
  <button>รับทราบ</button>
</Card>
```

## Props ทำได้อย่างเดียวคือ "อ่าน"

> ⚠️ **Props เป็น Read-only** — ห้ามแก้ไขค่า props ใน child component โดยตรง (Immutability)

```jsx
function Counter({ count }) {
  // ❌ ผิด — ห้าม mutate prop
  count = count + 1;

  // ✅ ต้องบอก parent ผ่าน callback
  return <button onClick={() => /* ส่ง event กลับ */}>+1</button>;
}
```

ถ้าต้องการเปลี่ยนค่า → ให้ parent ส่ง **function** มาเป็น prop (เรียกว่า "lifting state up"):

```jsx
function Counter({ count, onIncrement }) {
  return <button onClick={onIncrement}>นับ: {count}</button>;
}

function App() {
  const [count, setCount] = useState(0);
  return <Counter count={count} onIncrement={() => setCount(c => c + 1)} />;
}
```

## ลองเล่นเอง: Product List

```jsx live
{
  "files": {
    "/App.jsx": "import ProductList from './ProductList';\n\nconst products = [\n  { id: 1, name: 'หูฟัง Bluetooth', price: 1290, stock: 12, emoji: '🎧' },\n  { id: 2, name: 'คีย์บอร์ด Mechanical', price: 3490, stock: 5, emoji: '⌨️' },\n  { id: 3, name: 'เมาส์ไร้สาย', price: 890, stock: 0, emoji: '🖱️' },\n];\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-slate-100 p-8\">\n      <h1 className=\"text-3xl font-bold text-slate-900 mb-6\">สินค้าของเรา</h1>\n      <ProductList items={products} />\n    </div>\n  );\n}",
    "/ProductList.jsx": "import ProductCard from './ProductCard';\n\nexport default function ProductList({ items }) {\n  return (\n    <div className=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-4\">\n      {items.map(item => (\n        <ProductCard key={item.id} {...item} />\n      ))}\n    </div>\n  );\n}",
    "/ProductCard.jsx": "export default function ProductCard({ name, price, stock, emoji }) {\n  const inStock = stock > 0;\n  return (\n    <div className=\"bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition\">\n      <div className=\"text-5xl mb-3\">{emoji}</div>\n      <h3 className=\"font-bold text-slate-900 mb-1\">{name}</h3>\n      <p className=\"text-2xl font-extrabold text-blue-600 mb-2\">\n        ฿{price.toLocaleString()}\n      </p>\n      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${\n        inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'\n      }`}>\n        {inStock ? `คงเหลือ ${stock} ชิ้น` : 'สินค้าหมด'}\n      </span>\n    </div>\n  );\n}",
    "/index.js": "import { createRoot } from 'react-dom/client';\nimport App from './App.jsx';",
    "/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody { font-family: 'Inter', sans-serif; margin: 0; }"
  }
}
```

ลองแก้:
- เพิ่ม product ใหม่ใน array
- เปลี่ยน destructuring ใน `ProductCard` ให้รับแค่ `name` กับ `price` ดูว่าเกิดอะไรขึ้น
- เพิ่ม default value ให้ `stock = 0`

## สรุป

- **Props** = วิธีส่งข้อมูลจาก Parent → Child
- ใช้ **destructuring** เพื่ออ่านค่าที่ต้องการ
- ส่งได้ทุกชนิด: string, number, boolean, array, object, function
- **Children** = เนื้อหาที่อยู่ระหว่าง tag
- Props เป็น **read-only** — แก้ไม่ได้ ใช้ callback ส่ง event กลับ parent แทน

---

ถัดไป: **useState Hook** — ทำให้ UI เปลี่ยนตามข้อมูล 🔄