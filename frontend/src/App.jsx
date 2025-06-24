// frontend/src/App.jsx

import React, { useState, useEffect } from 'react'; // <--- เพิ่ม React เข้ามาที่นี่
import axios from 'axios';
import './index.css';

// URL ของ Backend API ที่เราจะเรียกใช้
// เราใช้ port 3001 ที่เราจะ map ใน docker-compose
const API_URL = 'http://localhost:3001';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // ฟังก์ชันสำหรับโหลดข้อมูล Todos ทั้งหมด
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);

      // --- จุด Debug ที่สำคัญที่สุด ---
      // เราจะพิมพ์ข้อมูลที่ได้จาก API ออกมาดูก่อนที่จะนำไปใช้งาน
      console.log("Data received from API:", response.data); 

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
      await axios.post(`${API_URL}/todos`, { task });
      setTask('');
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // U: ฟังก์ชันสำหรับสลับสถานะ (เสร็จ/ยังไม่เสร็จ)
  const handleToggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // D: ฟังก์ชันสำหรับลบ Todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      fetchTodos(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <p>Backend powered by: <strong>{window.BACKEND_NAME || '...'}</strong></p>
      <p>ElysiaJS + React + Postgres + Docker</p>
      {/* <p>Click on a todo to toggle its completion status.</p> */}

      {/* ฟอร์มสำหรับเพิ่ม Todo ใหม่ */}
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleTodo(todo.id, todo.completed)}>
              {todo.task}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;