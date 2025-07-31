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

## 🚀 Getting Started – How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/edublaze.git
cd edublaze
 Set Up the Backend:
cd server
npm install
Set Up the frontend:
cd frontend
npm install
Create a .env file inside the backend/ folder with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AT LAST : npm run dev for both server and frontend
