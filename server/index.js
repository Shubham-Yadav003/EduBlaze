import express from 'express';
import dotenv from "dotenv";
import { connectDb } from './database/db.js';
import userRoutes from './routes/user.js'
import coursesRoutes from './routes/course.js'
import adminRoutes from './routes/admin.js'
import Razorpay from "razorpay";
import cors from 'cors';

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
    // creating instance of razorpay

const app = express();

//using middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, // allow credentials to be sent
}));
const port = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send('Hello World!')
})

//importing routes and using routes
app.use("/uploads",express.static("uploads")); // for uploading files
app.use("/api", userRoutes);
app.use("/api", coursesRoutes);
app.use("/api", adminRoutes);


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
    connectDb();
})