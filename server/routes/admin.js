import express from 'express'
import {createCourse, addLectures, deleteLecture, deleteCourse, getAllStats, updateRole, getAllUser} from "../controllers/admin.js"
import {isAuth,isAdmin} from '../middlewares/isAuth.js';
import {uploadFiles} from '../middlewares/multer.js'; // multer middleware for uploading files


const router = express.Router();

router.post("/course/new", isAuth,isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse); 
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture); // delete lecture route
router.get("/stats", isAuth, isAdmin, getAllStats); // get all stats route
router.put("/user/:id", isAuth, isAdmin, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser)

export default router;