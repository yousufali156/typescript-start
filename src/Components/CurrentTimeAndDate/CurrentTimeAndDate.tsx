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

// QUOTES array: contains a list of motivational quotes to display.
const QUOTES: string[] = [
  "Believe you can and you're halfway there.",
  "Success is not final; failure is not fatal: It is the courage to continue that counts.",
  "Dream big and dare to fail.",
  "Do something today that your future self will thank you for.",
  "Stay positive, work hard, make it happen.",
];

// Todo type: defines the structure for a single to-do item.
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// TodosByDate type: defines the structure for the to-dos object, keyed by date.
type TodosByDate = {
  [dateKey: string]: Todo[];
};

const CurrentTimeAndDate: React.FC = () => {
  // currentDate state: holds the current month and year for calendar navigation.
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // selectedDate state: tracks the date clicked by the user to add to-dos.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // todos state: stores all to-do items, loaded from and saved to local storage.
  const [todos, setTodos] = useState<TodosByDate>(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  // inputValue state: controls the value of the to-do input field.
  const [inputValue, setInputValue] = useState<string>("");
  // quote state: holds a random motivational quote.
  const [quote, setQuote] = useState<string>("");
  // liveTime state: a separate state to handle the live time display without affecting the calendar.
  const [liveTime, setLiveTime] = useState<Date>(new Date());

  useEffect(() => {
    // Sets up a timer to update the current time every second for the clock.
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    // Cleanup function to clear the timer when the component unmounts.
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Saves the todos object to local storage whenever the todos state changes.
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    // Chooses a random quote from the QUOTES array on initial component load.
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  // goNextMonth function: navigates the calendar to the next month.
  const goNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
    setSelectedDate(null);
  };
  // goPrevMonth function: navigates the calendar to the previous month.
  const goPrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
    setSelectedDate(null);
  };

  // handleDayClick function: sets the selected date when a day in the calendar is clicked.
  const handleDayClick = (day: Date) => {
    if (isSameMonth(day, currentDate)) {
      setSelectedDate(day);
      setInputValue("");
    }
  };

  // goToToday function: navigates the calendar back to the current month and day.
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // handleAddTodo function: adds a new to-do item for the selected date.
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || inputValue.trim() === "") return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newTodo: Todo = { id: Date.now(), text: inputValue.trim(), completed: false };
    setTodos(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] ?? []), newTodo] }));
    setInputValue("");
  };

  // handleToggleComplete function: toggles the completion status of a to-do item.
  const handleToggleComplete = (dateKey: string, id: number) => {
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  // handleDeleteTodo function: removes a to-do item from the list.
  const handleDeleteTodo = (dateKey: string, id: number) => {
    setTodos(prev => ({ ...prev, [dateKey]: prev[dateKey].filter(t => t.id !== id) }));
  };

  // Calendar logic to determine days to display.
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const todosForSelectedDate = selectedKey ? todos[selectedKey] ?? [] : [];

  return (
    <div className="ct-container">
      {/* Big Time and Date section */}
      <div className="top-block">
        <div className="big-time">{format(liveTime, "hh:mm:ss a")}</div>
        <div className="big-date">{format(currentDate, "EEEE, do MMMM yyyy")}</div>
      </div>

      {/* Calendar Component */}
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={goPrevMonth}>&lt;</button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={goNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="day-name">{d}</div>)}
          {days.map(day => {
            const dayKey = format(day, "yyyy-MM-dd");
            const isOut = !isSameMonth(day, currentDate);
            const isSelected = selectedKey === dayKey;
            const hasTodos = (todos[dayKey] ?? []).length > 0;
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`day ${isOut ? "inactive" : ""} ${isToday(day) ? "today" : ""} ${isSelected ? "selected" : ""}`}
              >
                {format(day, "d")}
                {hasTodos && <div className="todo-dot" />}
              </div>
            );
          })}
        </div>

      </div>
      <div className="button-wrapper">
        <button onClick={goToToday} className="go-today-btn">
          Back to Home
        </button>
      </div>

      {/* To-Do App Section */}
      <div className="todo-app-container">
        {selectedDate ? (
          <>
            <h3>{format(selectedDate, "EEEE, MMMM do")}</h3>
            <form onSubmit={handleAddTodo}>
              <input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Add a new task..." />
              <button type="submit">Add</button>
            </form>
            <ul>
              {todosForSelectedDate.length ? todosForSelectedDate.map(todo => (
                <li key={todo.id} className={todo.completed ? "completed" : ""}>
                  <span onClick={() => selectedKey && handleToggleComplete(selectedKey, todo.id)}>{todo.text}</span>
                  <button onClick={() => selectedKey && handleDeleteTodo(selectedKey, todo.id)}>&times;</button>
                </li>
              )) : <p className="no-tasks-msg">No tasks for this day. Add one above!</p>}
            </ul>
          </>
        ) : <p className="select-date-msg">Select a date to see or add tasks.</p>}
      </div>

      {/* Quote Section */}
      <div className="quote-section">💡 "{quote}"</div>

      {/* Footer Section with Social Icons */}
      <footer className="footer">
        <p>Developed with ❤️ by Md. Yousuf Ali</p>
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/yousufali156" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/ios-filled/50/000000/linkedin.png" alt="LinkedIn" />
          </a>
          <a href="https://github.com/yousufali156" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="GitHub" />
          </a>
          <a href="https://yousufali-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/?size=100&id=zrTptiWiMTtu&format=png&color=000000" alt="Portfolio" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CurrentTimeAndDate;
