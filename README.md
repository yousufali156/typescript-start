# TypeScript-Start

> A React + TypeScript web application featuring a live clock, calendar with tasks/todos, and convenient navigation. Deployed on Vercel.

---

## 🚀 Table of Contents

1. [Demo](#demo)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Folder Structure](#folder-structure)  
7. [Contributing](#contributing)  
8. [License](#license)  

---

## 🎯 Demo

[Live Site](https://typescript-start.vercel.app/)  

---

## ✅ Features

- Live digital clock showing current time updated every second  
- Calendar view with month navigation (prev/next)  
- Tasks / Todo list per date; add / toggle / delete tasks  
- Persist tasks via `localStorage` so no data loss on refresh  
- UI with responsive design, user feedback (e.g. selected date highlight, task indicators)  
- Footer with social links and author information  

---

## 🛠 Tech Stack

| Tool                         | Purpose                 |
| ---------------------------- | ----------------------- |
| React                        | UI library              |
| TypeScript                   | Static typing           |
| date-fns                     | Date/time utilities     |
| Tailwind CSS / or custom CSS | Styling                 |
| Vite                         | Build tool / dev server |
| Vercel                       | Deployment platform     |

---

## ⚙ Installation

1. Clone the repo  
```bash
   git clone https://github.com/yourusername/typescript-start.git
   cd typescript-start
2. Install dependencies
```bash
    npm install

3. Start development server
```bash
    npm run dev
4.Build for production
```bash
    npm run build    






📋 Usage

The clock at the top displays current time & date.

Use the Prev / Next buttons to navigate months in the calendar.

Click a date (in current month) to select; then you can add, complete, or delete tasks for that date.

Tasks are stored in the browser’s local storage.

Footer includes author info and links.

📂 Folder Structure
typescript-start/
├── public/
├── src/
│   ├── Components/
│   │   ├── CurrentTimeAndDate/
│   │   │   ├── CurrentTimeAndDate.tsx
│   │   │   ├── CurrentTimeAndDate.css
│   │   ├── Time/
│   │   │   └── Time.tsx
│   ├── App.tsx
│   ├── main.tsx / index.tsx
│   ├── index.css
│   └── ...
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature/YourFeature)

Make your changes, commit with descriptive messages

Push to your branch, then make a Pull Request

I’m happy to review enhancements (UX, accessibility, styling, performance, etc.)

📝 License

This project is licensed under MIT License

👤 Author

Yousuf Ali
Portfolio 
 · GitHub
 · LinkedIn
