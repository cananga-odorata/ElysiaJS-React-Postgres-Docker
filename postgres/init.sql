-- สร้างตาราง todos
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);

-- ใส่ข้อมูลตัวอย่าง
INSERT INTO todos (task) VALUES ('Setup ElysiaJS Backend');
INSERT INTO todos (task) VALUES ('Create Vite + React Frontend');
INSERT INTO todos (task, completed) VALUES ('Configure Docker Compose', true);