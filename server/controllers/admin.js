import TryCatch from "../middlewares/tryCatch.js" 
import {Courses} from "../models/courses.js" // importing courses model
import {Lecture} from "../models/lecture.js" // importing lecture model
import {rm} from "fs" // fs module to remove files
import {promisify} from "util" // using for deleting the video
import fs from "fs"
import {user as User} from "../models/user.js"

export const createCourse = TryCatch(async (req, res) => {
 
    const {title,description,category,createdBy,duration,price} = req.body;
 
    const image = req.file; // multer will be used 

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path, // multer will give the path of image
    duration,
    price,
  });

  res.status(201).json({
    message: "Course created successfully",
  })
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id); // find course by id

  if(!course) {
    return res.status(404).json({ // 404 nnot found
      message: "Course not found",
    });
  }


  const {title, description } = req.body; // destructuring the body

  const file = req.file; // multer will give the path of video

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path, // path of video
    course: course._id, // course id
  });

  res.status(201).json({
    message: "Lecture added successfully",
    lecture,
  });
})

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id); // find lecture by id
  
  rm(lecture.video, ()=>{
    console.log("File deleted successfully"); // delete video file
  });

  await lecture.deleteOne(); // delete lecture

  res.json({message: "Lecture deleted successfully"}); // response
});

const unlinkAsync = promisify(fs.unlink); // for deleting
export const deleteCourse = TryCatch(async(req,res)=>{
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({course: course._id}); // find lectures of course

  await Promise.all(lectures.map(async(lecture)=>{
    await unlinkAsync(lecture.video); // delete video file
    console.log("video deleted");

  })
);

rm(course.image, ()=>{  // for deleting image of course
  console.log("image deleted")
})

await Lecture.find({course: req.params.id}).deleteMany();

await course.deleteOne();

await User.updateMany({}, {$pull:{subscription:req.params.id}}); // removing user from subscription array

res.json({
  message: "Course deleted successfully",
})
})

// get all stats
export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = (await Courses.find()).length; // no of courses
  const totalLectures = (await Lecture.find()).length; // no of lectures 
  const totalUsers = (await User.find()).length; // no of users

  const stats = {
    totalCourses,
    totalLectures,
    totalUsers,

  };

  res.json({
    stats,
  })
})

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({_id:{$ne: req.user._id}}).select("-password");
  res.json({users})
})

export const updateRole = TryCatch(async(req,res)=>{
  const user = await User.findById(req.params.id);

  if(user.role == "user"){
    user.role ="admin";
    await user.save();

    return res.status(200).json({
   message: "Role updated to admin",
    })
  }


   if(user.role == "admin"){
    user.role ="user";
    await user.save();

    return res.status(200).json({
   message: "Role updated ",
    })
  }
})

