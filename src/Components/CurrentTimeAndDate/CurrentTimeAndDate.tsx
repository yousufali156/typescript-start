import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import "./CurrentTimeandDate.css";
import Time from "../Time/Time";

const CurrentTimeAndDate: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState(() => {
    // Tries to get the saved todos from local storage when the component first loads.
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : {};
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Saves the todos to local storage whenever the todos state changes.
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
    setSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    if (isSameMonth(day, currentDate)) {
      setSelectedDate(day);
      setInputValue("");
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!selectedDate || inputValue.trim() === "") return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newTodo = { id: Date.now(), text: inputValue, completed: false };
    setTodos((prevTodos) => ({
      ...prevTodos,
      [dateKey]: [...(prevTodos[dateKey] || []), newTodo],
    }));
    setInputValue("");
  };

  const handleToggleComplete = (dateKey, todoId) => {
    setTodos((prevTodos) => ({
      ...prevTodos,
      [dateKey]: prevTodos[dateKey].map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  const handleDeleteTodo = (dateKey, todoId) => {
    setTodos((prevTodos) => ({
      ...prevTodos,
      [dateKey]: prevTodos[dateKey].filter((todo) => todo.id !== todoId),
    }));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const todosForSelectedDate = selectedDateKey ? todos[selectedDateKey] || [] : [];

  return (
    <div className="ct-container">
      {/* Big time at top */}
      <div className="top-block">
        <div className="big-time">{format(currentDate, "hh:mm:ss a")}</div>
        <div className="big-date">
          {format(currentDate, "EEEE, do MMMM yyyy")}
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar">
        <div className="calendar-header">
          <button className="nav-btn prev-btn" onClick={goToPreviousMonth}>
            &lt;
          </button>
          <h2 className="month-title">{format(currentDate, "MMMM yyyy")}</h2>
          <button className="nav-btn next-btn" onClick={goToNextMonth}>
            &gt;
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-name">
              {d}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`day ${!isSameMonth(day, currentDate) ? "inactive" : ""} ${
                isToday(day) ? "today" : ""
              } ${selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") ? "selected" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              {format(day, "d")}
              {todos[format(day, "yyyy-MM-dd")] && todos[format(day, "yyyy-MM-dd")].length > 0 && (
                <div className="todo-dot"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* To-Do App */}
      <div className="todo-app-container">
        {selectedDate ? (
          <div className="todo-list-wrapper">
            <h3 className="todo-date-title">{format(selectedDate, "EEEE, MMMM do")}</h3>
            <form className="todo-form" onSubmit={handleAddTodo}>
              <input
                type="text"
                className="todo-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new task..."
              />
              <button type="submit" className="todo-add-btn">Add</button>
            </form>
            <ul className="todo-list">
              {todosForSelectedDate.length > 0 ? (
                todosForSelectedDate.map((todo) => (
                  <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
                    <span className="todo-text" onClick={() => handleToggleComplete(selectedDateKey, todo.id)}>
                      {todo.text}
                    </span>
                    <button className="delete-btn" onClick={() => handleDeleteTodo(selectedDateKey, todo.id)}>
                      &times;
                    </button>
                  </li>
                ))
              ) : (
                <p className="no-tasks-msg">No tasks for this day. Add one above!</p>
              )}
            </ul>
          </div>
        ) : (
          <p className="select-date-msg">Select a date to see or add tasks.</p>
        )}
      </div>

      <section className="text-center">
        <Time></Time>
      </section>

      {/* Footer */}
      <div className="footer">
        <p className="footer-text">Developed with ❤️ by Md. Yousuf Ali</p>
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/yousufali-portfolio" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" className="social-icon" />
          </a>
          <a href="https://github.com/yousuf-alii" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" className="social-icon" />
          </a>
          <a href="https://yousufali-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/?size=100&id=zrTptiWiMTtu&format=png&color=000000" alt="Portfolio" className="social-icon" />
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default CurrentTimeAndDate;