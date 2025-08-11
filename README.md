# 🚀 EduBlaze – Smart E-Learning Platform

**EduBlaze** is an interactive e-learning platform designed to support self-paced learning with structured content, quizzes, progress tracking, and a user-friendly interface. Built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, EduBlaze ensures a smooth and scalable user experience for both students and administrators.

---

## 🔍 Features

- 📚 Course management with content modules
- ✅ Quiz and assessment functionality
- 📊 User dashboard to track learning progress
- 🔐 Secure authentication using JWT
- 🧑‍🏫 Role-based access for students and admins
- 🎨 Clean, responsive UI using Tailwind CSS
- 🤖 AI for customer assistance using Google Gemini API.


---

## 🛠️ Tech Stack

### Backend
- **Node.js** – Runtime environment for server-side development
- **Express.js** – Web framework for handling routes and APIs
- **MongoDB** – NoSQL database to store users, courses, and progress
- **JWT (JSON Web Tokens)** – For secure authentication and session handling
- **Mongoose** – ODM for MongoDB

### Frontend
- **React.js** – Component-based frontend framework
- **Tailwind CSS** – Utility-first CSS framework for responsive design
- **Axios** – For making API requests to the backend
- **React Router** – Client-side routing for navigating pages

---

🚀 Getting Started:- 📋 Prerequisites:

🖥️ Node.js v18+

📦 npm or yarn

🗄️ MongoDB (local or cloud)

1️⃣ Clone Repository
git clone https://github.com/Shubham-Yadav003/EduBlaze.git
cd EduBlaze

2️⃣ Backend Setup
cd server
npm install
Create .env in /server with:
PORT=5000
MONGO_URL=your_mongodb_connection_string
Jwt_Sec=your_jwt_secret
Activation_Secret=your_activation_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
Start backend: npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install
Start frontend: npm run dev
🌐 App runs at http://localhost:5173

📂 Folder Structure:
server/ — Express backend (API, DB, controllers, models)
frontend/ — React frontend (components, pages, assets)

⚡ Scripts:
Backend: npm run dev (dev), npm start (prod)
Frontend: npm run dev (dev), npm run build (prod)

🚢 Deployment:
cd frontend && npm run build
Serve the build folder or integrate with backend.

💡 Credits: React, Vite, Express, MongoDB, Gemini API
