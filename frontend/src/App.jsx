// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { configEnv } from "./core/config.env";
// URL ของ Backend API ที่เราจะเรียกใช้
// เราใช้ port 3001 ที่เราจะ map ใน docker-compose


function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");

  // ฟังก์ชันสำหรับโหลดข้อมูล Todos ทั้งหมด
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${configEnv.API_URL}/todos`);

      // --- จุด Debug ที่สำคัญที่สุด ---
      // เราจะพิมพ์ข้อมูลที่ได้จาก API ออกมาดูก่อนที่จะนำไปใช้งาน
      // console.log("Data received from API:", response.data);

      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // กรณีเกิด error, เราอาจจะตั้งค่าให้ todos เป็น array ว่างๆ เพื่อป้องกันแอปพัง
      setTodos([]);
    }
  };

  // เรียก fetchTodos ครั้งแรกเมื่อ Component โหลดเสร็จ
  useEffect(() => {
    fetchTodos();
  }, []);

  // C: ฟังก์ชันสำหรับเพิ่ม Todo ใหม่
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      await axios.post(`${configEnv.API_URL}/todos`, { task, description });
      setTask("");
      setDescription("");
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // U: ฟังก์ชันสำหรับสลับสถานะ (เสร็จ/ยังไม่เสร็จ)
  const handleToggleTodo = async (id, completed) => {
    try {
      await axios.put(`${configEnv.API_URL}/todos/${id}`, { completed: !completed });
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // D: ฟังก์ชันสำหรับลบ Todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${configEnv.API_URL}/todos/${id}`);
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // ฟังก์ชันสำหรับ Export ข้อมูลเป็น CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Task", "Description", "Completed"];
    const rows = todos.map((todo) =>
      [todo.id, todo.task, todo.description, todo.completed].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "todos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // ฟังก์ชันสำหรับ Copy ตาราง
  const handleCopyTable = () => {
    const table = document.querySelector(".todo-table");
    if (table) {
      const range = document.createRange();
      range.selectNode(table);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      alert("Table copied to clipboard!");
    }
  };

  // ฟังก์ชันสำหรับ Copy ข้อมูลตาม Format ที่กำหนด
  const handleCopyFormatted = () => {
    const formattedText = todos
      .map(
        (todo) =>
          `- ${todo.description || ""} \`${todo.task}\` ${
            todo.completed ? "✅" : "🔄"
          }`
      )
      .join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedText).then(
        () => {
          alert("Formatted tasks copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy formatted text: ", err);
          alert("Failed to copy.");
        }
      );
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = formattedText;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Formatted tasks copied to clipboard!");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        alert("Failed to copy.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <p>
        Backend powered by: <strong>{window.BACKEND_NAME || "..."}</strong>
      </p>
      <p>ElysiaJS + React + Postgres + Docker</p>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="table-actions">
        <button onClick={handleCopyTable}>Copy Table</button>
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleCopyFormatted}>Copy Formatted</button>
      </div>

      <table className="todo-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr
              key={todo.id}
              className={todo.completed ? "completed" : ""}
            >
              <td
                className="task-cell"
                onClick={() => handleToggleTodo(todo.id, todo.completed)}
              >
                {todo.task}
              </td>
              <td>{todo.description}</td>
              <td>{todo.completed ? "Completed" : "Pending"}</td>
              <td>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-btn"
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;