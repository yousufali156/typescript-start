import { useEffect, useState } from "react";

const Time: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl px-8 py-6 border border-white/20 text-center w-full max-w-md transition-transform hover:scale-105">
        {/* Time */}
        <p className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-sm">
          {currentTime.toLocaleTimeString()}
        </p>

        {/* Date */}
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Small tagline */}
        <p className="mt-4 text-sm text-gray-500 italic">
          Stay productive, one second at a time ⏳
        </p>
      </div>
    </div>
  );
};

export default Time;
