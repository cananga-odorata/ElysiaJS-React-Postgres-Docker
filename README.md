# เปรียบเทียบ ORM บน Full-Stack: Prisma vs. Drizzle

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-fff?style=for-the-badge&logo=elysia&logoColor=black)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

โปรเจกต์นี้เป็นแอปพลิเคชัน Todo List แบบ Full-stack ที่สร้างขึ้นเพื่อเปรียบเทียบการใช้งาน, ประสบการณ์การพัฒนา, และการตั้งค่าระหว่าง ORM สองตัวที่ได้รับความนิยมในโลกของ TypeScript คือ **Prisma** และ **Drizzle ORM** บน Tech Stack ที่ทันสมัยและเน้นประสิทธิภาพ

---

## เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend:**
    * [React](https://reactjs.org/) (UI Library)
    * [Vite](https://vitejs.dev/) (Build Tool)
    * [Axios](https://axios-http.com/) (HTTP Client)
* **Backend:**
    * [ElysiaJS](https://elysiajs.com/) (Web Framework for Bun)
    * [Bun](https://bun.sh/) (JavaScript Runtime)
* **Database & ORM:**
    * [PostgreSQL](https://www.postgresql.org/)
    * **เวอร์ชัน 1:** [Prisma](https://www.prisma.io/)
    * **เวอร์ชัน 2:** [Drizzle ORM](https://orm.drizzle.team/)
* **DevOps:**
    * [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## โครงสร้างโปรเจกต์

```
orm-showdown/
├── backend-drizzle/      #<-- โค้ด Backend เวอร์ชัน Drizzle
│   ├── src/
│   ├── drizzle/          #<-- ไฟล์ Migration ของ Drizzle (ถูก generate)
│   ├── drizzle.config.ts
│   └── ...
│
├── backend-prisma/       #<-- โค้ด Backend เวอร์ชัน Prisma
│   ├── prisma/
│   │   ├── migrations/   #<-- ไฟล์ Migration ของ Prisma (ถูก generate)
│   │   └── schema.prisma
│   └── ...
│
├── frontend/             #<-- โค้ด Frontend (ใช้ร่วมกัน)
│   └── ...
│
├── docker-compose.drizzle.yml  #<-- ไฟล์ควบคุมเวอร์ชัน Drizzle
└── docker-compose.prisma.yml   #<-- ไฟล์ควบคุมเวอร์ชัน Prisma
```

---

## สิ่งที่ต้องมี (Prerequisites)

* [Docker](https://www.docker.com/products/docker-desktop/) และ Docker Compose
* [Bun](https://bun.sh/docs/installation) (สำหรับรันคำสั่ง generate migration บนเครื่อง)

---

## การติดตั้งและรันโปรเจกต์

โปรเจกต์นี้มี 2 เวอร์ชันที่แยกกันโดยสิ้นเชิง ให้เลือกรันทีละเวอร์ชัน

### สำหรับเวอร์ชัน Prisma

**ขั้นตอนที่ 1: สร้างไฟล์ Migration (ทำครั้งเดียว)**

1.  **หยุด Container ทั้งหมด (ถ้ามี):** `docker-compose down -v`
2.  **เริ่มเฉพาะฐานข้อมูล:** `docker-compose up -d db`
3.  **สร้างไฟล์ `.env`:** ในโฟลเดอร์ `backend-prisma/` ให้สร้างไฟล์ชื่อ `.env` แล้วใส่เนื้อหา:
    ```
    DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb"
    ```
4.  **Generate Migration:** เข้าไปที่โฟลเดอร์ `backend-prisma` แล้วรันคำสั่ง:
    ```bash
    cd backend
    bun install
    bunx prisma migrate dev --name init
    cd .. 
    ```
5.  **หยุดฐานข้อมูล:** `docker-compose down`

**ขั้นตอนที่ 2: รันโปรเจกต์ทั้งหมด**

```bash
docker-compose up --build -d
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` คุณจะเห็นข้อความ "Backend powered by: **Prisma**"

### สำหรับเวอร์ชัน Drizzle

**ขั้นตอนที่ 1: สร้างไฟล์ Migration (ทำครั้งเดียว)**

1.  **หยุด Container ทั้งหมด (ถ้ามี):** `docker-compose down -v`
2.  **เริ่มเฉพาะฐานข้อมูล:** `docker-compose up -d db`
3.  **สร้างไฟล์ `.env`:** ในโฟลเดอร์ `backend-drizzle/` ให้สร้างไฟล์ชื่อ `.env` แล้วใส่เนื้อหา:
    ```
    DATABASE_URL="postgresql://myuser:mypassword@localhost:5433/mydb"
    ```
4.  **Generate Migration:** เข้าไปที่โฟลเดอร์ `backend-drizzle` แล้วรันคำสั่ง:
    ```bash
    cd backend
    bun install
    bun run db:generate
    cd ..
    ```
5.  **หยุดฐานข้อมูล:** `docker-compose down`

**ขั้นตอนที่ 2: รันโปรเจกต์ทั้งหมด**

```bash
docker-compose up --build -d
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` คุณจะเห็นข้อความ "Backend powered by: **Drizzle**"

---

## ข้อแตกต่างและข้อสังเกต

จากการสร้างโปรเจกต์นี้ ทำให้เห็นความแตกต่างในปรัชญาของ ORM ทั้งสองตัวอย่างชัดเจน:

* **Prisma** ให้ความรู้สึกเหมือนเป็น **"กล่องเครื่องมือครบวงจร" (All-in-one)** ที่ใช้งานง่ายมาก ทุกอย่างถูกเตรียมมาให้พร้อมตั้งแต่ Client ที่ Type-safe อย่างสมบูรณ์ไปจนถึงระบบ Migration ที่ทรงพลัง เหมาะสำหรับทีมที่ต้องการเริ่มต้นอย่างรวดเร็วและต้องการประสบการณ์การพัฒนาที่ราบรื่นที่สุด โดยต้องแลกมากับ "ความหนัก" ของ Query Engine ที่มี System Dependencies (เช่น `openssl`)

* **Drizzle ORM** ให้ความรู้สึก **"ใกล้ชิดกับ SQL มากกว่า"** และเน้นความ **"เบาและเร็ว"** อย่างแท้จริง มันเป็นเพียง Layer บางๆ ที่ให้ Type Safety ครอบการเขียน SQL ของเรา ทำให้มี Overhead น้อยมากและยืดหยุ่นสูง เหมาะสำหรับนักพัฒนาที่รัก SQL, ต้องการรีดประสิทธิภาพสูงสุด และไม่กลัวที่จะต้องตั้งค่าหรือเขียนสคริปต์บางอย่างด้วยตัวเอง ซึ่งเข้ากับปรัชญาของ ElysiaJS และ Bun ได้เป็นอย่างดี