import TryCatch from "../middlewares/tryCatch.js";
import { Lecture } from "../models/lecture.js"
import { Courses } from "../models/courses.js"
import { user as User } from "../models/user.js"
import { instance } from "../index.js"
import { Payment } from "../models/Payment.js"
import crypto from "crypto"
import { Progress } from "../models/Progress.js"

export const getAllCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find();
    res.json({
        courses,
    })
})


export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    res.json({
        course,
    });
});


export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });

    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.mainrole === "superadmin") {
        return res.json({ lectures });
    }

    if (!user.subscription.includes(req.params.id))
        return res.status(400).json({
            message: "You have not subscribed to the course",
        })

    res.json({ lectures });
});


export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.mainrole === "superadmin") {
        return res.json({ lecture });
    }

    if (!user.subscription.includes(lecture.course)) // checking if user has subscribed to the course of this lecture
        return res.status(400).json({
            message: "You have not subscribed to the course",
        })

    res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
    let courses;
    
    if (req.user.role === "admin" || req.user.mainrole === "superadmin") {
        // For admins and superadmins, show all courses or courses they created
        if (req.user.mainrole === "superadmin") {
            courses = await Courses.find(); // Show all courses for superadmin
        } else {
            courses = await Courses.find({ createdBy: req.user.name }); // Show only courses created by admin
        }
    } else {
        // For regular users, show only subscribed courses
        courses = await Courses.find({ _id: req.user.subscription });
    }

    res.json({
        courses,
    });
});


export const checkout = TryCatch(async (req, res) => { // for payment
    const user = await User.findById(req.user._id); // finding user
    const course = await Courses.findById(req.params.id); // finding course

    if (user.subscription.includes(course._id)) {
        return res.status(400).json({
            message: "Already subscribed to the course",
        });
    }

    // if not subscribed this course
    const options = {
        amount: Number(course.price * 100), // razapay only take number 
        currency: "INR",
    }

    const order = await instance.orders.create(options); // creating order
    res.status(200).json({
        order,
        course,
    })
});

//payment verification
export const paymentVerification = TryCatch(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256",
        process.env.RAZORPAY_SECRET
    ).update(body).digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        const user = await User.findById(req.user._id); // finding user

        const course = await Courses.findById(req.params.id); // finding course

        user.subscription.push(course._id); // pushing course id in subscription

        await Progress.create({ // creating progress for user

            course: course._id,
            completedLectures: [], // initially no lectures are completed  
            user: req.user._id, // user id
        })

        await user.save(); // saving user

        res.status(200).json({
            message: "Course Purchased Successfully",
        });
    } else {
        res.status(400).json({
            message: "Payment Failed"
        })
    }

})

export const addProgress = TryCatch(async (req, res) => {
    let progress = await Progress.findOne({
        user: req.user._id,
        course: req.query.course,
    });

    // If no progress exists, create one for admins and superadmins
    if (!progress && (req.user.role === "admin" || req.user.mainrole === "superadmin")) {
        progress = await Progress.create({
            course: req.query.course,
            completedLectures: [],
            user: req.user._id,
        });
    }

    // If still no progress (for regular users), return error
    if (!progress) {
        return res.status(404).json({
            message: "No progress found for this course",
        });
    }

    const { lectureId } = req.query;
    if (progress.completedLectures.includes(lectureId)) {
        return res.status(400).json({
            message: "Progress Recorded",
        });
    }

    progress.completedLectures.push(lectureId); // adding lecture id to completed lectures

    await progress.save(); // saving progress

    res.status(201).json({
        message: " New Progress Recorded",
    });
});

// export const getYourProgress = TryCatch(async (req, res) => {
//     const progress = await Progress.find({
//         user: req.user._id,
//         course: req.query.course,
//     });

//     if (!progress || progress.length===0) return res.status(404).json({
//         message: "No Progress Found",
//     })

//     const allLectures = (await Lecture.find({ course: req.query.course })).length; // getting all lectures of course
//     const completedLectures = progress[0].completedLectures.length; // getting completed lectures of user

//     const courseProgressPercentage = allLectures === 0 ? 0 : (completedLectures * 100) / allLectures;
// // calculating progress percentage
//     res.json({
//         courseProgressPercentage,
//         completedLectures,
//         allLectures,
//         progress,// returning progress object
//     })


// })

export const getYourProgress = TryCatch(async (req, res) => {
  let progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  // If no progress exists, create one for admins and superadmins
  if (!progress && (req.user.role === "admin" || req.user.mainrole === "superadmin")) {
    progress = await Progress.create({
      course: req.query.course,
      completedLectures: [],
      user: req.user._id,
    });
  }

  // If still no progress (for regular users), return empty progress
  if (!progress) {
    const allLectures = (await Lecture.find({ course: req.query.course })).length;
    return res.json({
      courseProgressPercentage: 0,
      completedLectures: 0,
      allLectures,
      progress: null,
    });
  }

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress.completedLectures.length;

  const courseProgressPercentage = allLectures === 0 ? 0 : (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});