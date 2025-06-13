import express from 'express'
import { fetchLecture, fetchLectures, getAllCourses, getSingleCourse, getMyCourses, checkout, paymentVerification} from '../controllers/course.js';
import {isAuth} from '../middlewares/isAuth.js';

const router = express.Router();

router.get("/course/all", getAllCourses)
router.get("/course/:id", getSingleCourse)
router.get("/lectures/:id", isAuth, fetchLectures)
router.get("/lecture/:id", isAuth, fetchLecture)
router.get("/mycourse", isAuth, getMyCourses); // getting all my courses
router.post("/course/checkout/:id", isAuth,checkout); 
router.post("/verification/:id", isAuth, paymentVerification); // payment verification route
export default router;
