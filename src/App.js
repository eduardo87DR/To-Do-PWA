import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, PlusCircle } from "lucide-react";
import Modal from "./Modal";
import "./App.css";
import { showNotification, requestNotificationPermission } from "./utils/notifications";

function App() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  const [text, setText] = useState("");
  const [modal, setModal] = useState({ isOpen: false, message: "", title: "", icon: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const openModal = (title, message, icon) => {
    setModal({ isOpen: true, title, message, icon });
    setTimeout(() => setModal({ isOpen: false, title: "", message: "", icon: "" }), 1400);
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setTodos([
      ...todos,
      { id: Date.now(), text, completed: false, date: formattedDate, time: formattedTime },
    ]);
    setText("");
    openModal("Tarea agregada", "Se ha agregado la tarea correctamente!", "plus");

    showNotification(`Nueva tarea agregada: "${text}"`);

  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    openModal("Tarea actualizada", "El estado de la tarea ha cambiado.", "check");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    openModal("Tarea eliminada", "La tarea se ha eliminado con éxito.", "trash");

    showNotification(`Tarea eliminada correctamente: "${text}"`);

  };

  // === PAGINACIÓN ===
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleTodos = todos.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="AppWrapper">
      <div className="App">
        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lista de Tareas
        </motion.h1>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <PlusCircle size={22} />
          </button>
        </form>

        <div className="todo-container">
          {visibleTodos.length === 0 ? (
            <p className="empty">No hay tareas aún</p>
          ) : (
            visibleTodos.map((todo) => (
              <motion.div
                key={todo.id}
                className={`todo-card ${todo.completed ? "completed" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>

                <div className="todo-meta">
                  <div className="todo-datetime">
                    <small>{todo.date}</small>
                    <small>{todo.time}</small>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              ← Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() =>
          setModal({ isOpen: false, message: "", title: "", icon: "" })
        }
        title={modal.title}
        icon={modal.icon}
      >
        <p>{modal.message}</p>
      </Modal>
    </div>
  );
}

export default App;
