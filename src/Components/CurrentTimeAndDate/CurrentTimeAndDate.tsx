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
  "And whoever relies upon Allah – then He is sufficient for him. (Quran 65:3)",
  "Indeed, with hardship\ncomes ease. (Quran 94:6)",
  "Do not lose hope, nor be sad. (Quran 3:139)",
  "So remember Me;\nI will remember you. (Quran 2:152)",
  "Allah does not burden a soul\nbeyond that it can bear. (Quran 2:286)",
  "And He found you lost\nand guided you. (Quran 93:7)",
  "So verily, with hardship,\nthere is relief. (Quran 94:5)",
  "Indeed, Allah is with the patient. (Quran 2:153)",
  "And whoever fears Allah –\nHe will make for him a way out. (Quran 65:2)",
  "Indeed, my Lord is near\nand responsive. (Quran 11:61)",
  "And establish prayer\nfor My remembrance. (Quran 20:14)",
  "So be patient.\nIndeed, the promise of Allah is truth. (Quran 30:60)",
  "And He is with you\nwherever you are. (Quran 57:4)",
  "Indeed, the help of Allah is near. (Quran 2:214)",
  "Verily, in the remembrance of Allah\ndo hearts find rest. (Quran 13:28)",
  "Do not despair of the mercy of Allah. (Quran 39:53)",
  "Say: My Lord, increase me in knowledge. (Quran 20:114)",
  "The best among you are those\nwho have the best manners. (Hadith – Bukhari)",
  "Whoever follows a path to seek knowledge,\nAllah will make easy for him a path to Paradise. (Hadith – Muslim)",
  "The strong man is not the one\nwho can overpower others,\nbut the one who controls himself in anger. (Hadith – Bukhari)",
  "The most beloved deed to Allah\nis the most regular and constant,\neven if it is small. (Hadith – Bukhari)",
  "Make things easy\nand do not make them difficult,\ngive glad tidings and do not repel people. (Hadith – Bukhari)",
  "He who does not thank people,\ndoes not thank Allah. (Hadith – Abu Dawood)",
  "The best of you are those\nwho are best to their wives. (Hadith – Tirmidhi)",
  "A good word is charity. (Hadith – Bukhari)",
  "Smiling at your brother is charity. (Hadith – Tirmidhi)",
  "The best of people are those\nthat bring most benefit to the rest of mankind. (Hadith – Daraqutni)",
  "Whoever believes in Allah and the Last Day\nshould speak what is good or keep silent. (Hadith – Bukhari)",
  "Do not waste water,\neven if you perform ablution\non the bank of a rushing river. (Hadith – Ibn Majah)",
  "Allah loves those\nwho put their trust in Him. (Quran 3:159)",
  "Be mindful of Allah,\nyou will find Him before you. (Hadith – Tirmidhi)",
  "Charity does not decrease wealth. (Hadith – Muslim)",
  "The best richness is the richness of the soul. (Hadith – Bukhari)",
  "Fear Allah wherever you are. (Hadith – Tirmidhi)",
  "Help your brother,\nwhether he is an oppressor or oppressed. (Hadith – Bukhari)",
  "The world is a prison for the believer\nand a paradise for the disbeliever. (Hadith – Muslim)",
  "The most perfect believer in faith\nis the one with the best character. (Hadith – Tirmidhi)",
  "A kind word with forgiveness\nis better than charity followed by injury. (Quran 2:263)",
  "Race towards forgiveness\nfrom your Lord. (Quran 57:21)",
  "Indeed, prayer prohibits immorality and wrongdoing. (Quran 29:45)",
  "And He is the Forgiving,\nthe Affectionate. (Quran 85:14)",
  "Do good, as Allah has done good to you. (Quran 28:77)",
  "Whoever is patient, Allah will make him patient. (Hadith – Bukhari)",
  "Purity is half of faith. (Hadith – Muslim)",
  "Exchange gifts,\nas that will lead to increasing your love. (Hadith – Bukhari)",
  "The believer’s shade on the Day of Resurrection\nwill be his charity. (Hadith – Tirmidhi)",
  "Every act of kindness is charity. (Hadith – Bukhari)",
  "The most beloved places to Allah\nare the mosques. (Hadith – Muslim)",
  "Modesty is part of faith. (Hadith – Bukhari)",
  "Do not envy one another. (Hadith – Muslim)",
  "Whoever guides someone to virtue\nwill be rewarded equivalent to him. (Hadith – Muslim)",
  "The mercy of Allah is close\nto the doers of good. (Quran 7:56)",
  "And your Lord says, Call upon Me;\nI will respond to you. (Quran 40:60)",
  "Do not follow your desire,\nfor it will mislead you. (Quran 38:26)",
  "Lower your wing\nto the believers. (Quran 15:88)",
  "Kind speech and forgiveness\nare better than charity. (Quran 2:263)",
  "He who has no kindness\nhas no faith. (Hadith – Muslim)",
  "Do not waste time,\nfor time is life. (Hadith – Ibn Qayyim)",
  "The most truthful word is\n‘La ilaha illallah’. (Hadith – Bukhari)",
  "Contentment is a treasure\nthat never ends. (Hadith – Bayhaqi)",
  "The best jihad is\nagainst your own soul. (Hadith – Tirmidhi)",
  "Allah loves those who repent often. (Quran 2:222)",
  "And be grateful to Allah\nif it is Him you worship. (Quran 2:172)",
  "Do not kill the soul\nwhich Allah has forbidden. (Quran 17:33)",
  "And establish prayer at the two ends of the day. (Quran 11:114)",
  "Truly, Allah loves those\nwho rely upon Him. (Quran 3:159)",
  "Your smile for your brother\nis charity. (Hadith – Tirmidhi)",
  "Avoid suspicion,\nfor suspicion is the worst of false tales. (Hadith – Bukhari)",
  "Do not be angry\nand Paradise is yours. (Hadith – Tabarani)",
  "The best among you are those\nwho learn the Qur’an and teach it. (Hadith – Bukhari)",
  "And give glad tidings to the patient. (Quran 2:155)",
  "The best of wealth is the tongue that remembers Allah. (Hadith – Tirmidhi)",
  "Do not oppress one another. (Hadith – Muslim)",
  "Save yourself from Hell-fire\neven by giving half a date-fruit in charity. (Hadith – Bukhari)",
  "The best charity is\nthat given in Ramadan. (Hadith – Tirmidhi)",
  "Exchange greetings of peace\nto increase love among you. (Hadith – Muslim)",
  "Seek knowledge\nfrom the cradle to the grave. (Hadith – Bayhaqi)",
  "The ink of the scholar is more sacred\nthan the blood of the martyr. (Hadith – Tirmidhi)",
  "The believer is not the one who eats his fill\nwhile his neighbor goes hungry. (Hadith – Bukhari)",
  "The cure for ignorance\nis to ask questions. (Hadith – Abu Dawood)",
  "And We have not sent you\nexcept as a mercy to the worlds. (Quran 21:107)",
  "Riches does not mean having many possessions,\nbut contentment. (Hadith – Muslim)",
  "Seek forgiveness often,\nfor Allah is most forgiving. (Quran 71:10)",
  "Keep your tongue moist\nwith the remembrance of Allah. (Hadith – Tirmidhi)",
  "And rush to forgiveness\nfrom your Lord. (Quran 3:133)",
  "Envy consumes good deeds\njust as fire consumes wood. (Hadith – Abu Dawood)",
  "Whoever fasts Ramadan\nwith faith and seeking reward,\nhis past sins will be forgiven. (Hadith – Bukhari)",
  "Prayer is light,\ncharity is proof,\npatience is illumination. (Hadith – Muslim)",
  "When you are greeted with a greeting,\nrespond with one better. (Quran 4:86)",
  "And Allah loves the doers of good. (Quran 3:134)",
  "The best of companions\nwith Allah is the one who is best to his companion. (Hadith – Tirmidhi)",
  "Do not look at those above you,\nlook at those below you. (Hadith – Muslim)",
  "The best of provision is piety. (Quran 2:197)",
  "Do not laugh too much,\nfor much laughter kills the heart. (Hadith – Tirmidhi)",
  "A believer is not bitten twice\nfrom the same hole. (Hadith – Bukhari)",
  "The best remembrance is\n‘La ilaha illallah’. (Hadith – Tirmidhi)",
  "The most beloved words to Allah are\nSubhanAllah, Alhamdulillah,\nLa ilaha illallah, Allahu Akbar. (Hadith – Muslim)"
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
      <div className="quote-section quote">💡 "{quote}"</div>

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