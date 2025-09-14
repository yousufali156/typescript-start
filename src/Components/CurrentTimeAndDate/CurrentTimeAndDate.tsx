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
import "./CurrentTimeAndDate.css";

import Time from "../Time/Time";

/* Types -------------------------------------------------------------- */

// Single todo item type
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// Todos grouped by date string "yyyy-MM-dd"
type TodosByDate = {
  [dateKey: string]: Todo[];
};

/* Component ---------------------------------------------------------- */

const CurrentTimeAndDate: React.FC = () => {
  // Live clock date (used for header and current displayed month)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Selected date for todo operations (null when no date is selected)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Todos state, loaded from localStorage on init
  const [todos, setTodos] = useState<TodosByDate>(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? (JSON.parse(saved) as TodosByDate) : {};
    } catch {
      return {};
    }
  });

  // Input value for adding a todo
  const [inputValue, setInputValue] = useState<string>("");

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist todos to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch {
      // ignore localStorage errors
    }
  }, [todos]);

  /* Month navigation ------------------------------------------------- */

  // Advance the displayed month (affects calendar grid)
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
    setSelectedDate(null);
  };

  // Go back one month
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
    setSelectedDate(null);
  };

  /* Todo handlers ---------------------------------------------------- */

  // Click a day in the calendar — only allow selecting days in the displayed month
  const handleDayClick = (day: Date) => {
    if (isSameMonth(day, currentDate)) {
      setSelectedDate(day);
      setInputValue("");
    }
  };

  // Add a new todo for the selected date
  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) return;
    const trimmed = inputValue.trim();
    if (trimmed === "") return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newTodo: Todo = { id: Date.now(), text: trimmed, completed: false };

    setTodos((prevTodos) => ({
      ...prevTodos,
      [dateKey]: [...(prevTodos[dateKey] ?? []), newTodo],
    }));

    setInputValue("");
  };

  // Toggle complete state of a todo
  const handleToggleComplete = (dateKey: string, todoId: number) => {
    setTodos((prevTodos) => {
      const list = prevTodos[dateKey] ?? [];
      return {
        ...prevTodos,
        [dateKey]: list.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
      };
    });
  };

  // Delete a todo
  const handleDeleteTodo = (dateKey: string, todoId: number) => {
    setTodos((prevTodos) => {
      const list = prevTodos[dateKey] ?? [];
      return {
        ...prevTodos,
        [dateKey]: list.filter((t) => t.id !== todoId),
      };
    });
  };

  /* Calendar computation --------------------------------------------- */

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const todosForSelectedDate: Todo[] = selectedDateKey ? todos[selectedDateKey] ?? [] : [];

  /* Input change handler type-safe */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="ct-container">
      {/* Big time at top */}
      <div className="top-block">
        <div className="big-time">{format(currentDate, "hh:mm:ss a")}</div>
        <div className="big-date">{format(currentDate, "EEEE, do MMMM yyyy")}</div>
      </div>

      {/* Calendar */}
      <div className="calendar">
        <div className="calendar-header">
          <button
            className="nav-btn prev-btn"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            type="button"
          >
            &lt;
          </button>

          <h2 className="month-title">{format(currentDate, "MMMM yyyy")}</h2>

          <button
            className="nav-btn next-btn"
            onClick={goToNextMonth}
            aria-label="Next month"
            type="button"
          >
            &gt;
          </button>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-name">
              {d}
            </div>
          ))}

          {days.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const isOutOfMonth = !isSameMonth(day, currentDate);
            const isSelected =
              selectedDateKey !== null && selectedDateKey === dayKey;
            const hasTodos = (todos[dayKey] ?? []).length > 0;

            return (
              <div
                key={day.toISOString()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleDayClick(day);
                  }
                }}
                onClick={() => handleDayClick(day)}
                className={`day ${isOutOfMonth ? "inactive" : ""} ${isToday(day) ? "today" : ""} ${
                  isSelected ? "selected" : ""
                }`}
              >
                {format(day, "d")}
                {hasTodos && <div className="todo-dot" aria-hidden />}
              </div>
            );
          })}
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
                onChange={handleInputChange}
                placeholder="Add a new task..."
                name="todo"
                aria-label="New todo"
              />
              <button type="submit" className="todo-add-btn">Add</button>
            </form>

            <ul className="todo-list">
              {todosForSelectedDate.length > 0 ? (
                todosForSelectedDate.map((todo: Todo) => (
                  <li
                    key={todo.id}
                    className={`todo-item ${todo.completed ? "completed" : ""}`}
                  >
                    <span
                      className="todo-text"
                      onClick={() => selectedDateKey && handleToggleComplete(selectedDateKey, todo.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          selectedDateKey && handleToggleComplete(selectedDateKey, todo.id);
                        }
                      }}
                    >
                      {todo.text}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => selectedDateKey && handleDeleteTodo(selectedDateKey, todo.id)}
                      aria-label={`Delete todo ${todo.text}`}
                      type="button"
                    >
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

      {/* Optional Time component */}
      <section className="text-center">
        <Time />
      </section>

      {/* Footer */}
      <div className="footer">
        <p className="footer-text">Developed with ❤️ by Md. Yousuf Ali</p>
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/yousufali-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/linkedin.png"
              alt="LinkedIn"
              className="social-icon"
            />
          </a>

          <a
            href="https://github.com/yousuf-alii"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/github.png"
              alt="GitHub"
              className="social-icon"
            />
          </a>

          <a
            href="https://yousufali-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio"
          >
            <img
              src="https://img.icons8.com/?size=100&id=zrTptiWiMTtu&format=png&color=000000"
              alt="Portfolio"
              className="social-icon"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeAndDate;
