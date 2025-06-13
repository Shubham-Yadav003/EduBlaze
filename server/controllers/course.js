import TryCatch from "../middlewares/tryCatch.js";
import {Lecture} from "../models/lecture.js"
import {Courses} from "../models/courses.js"
import {user as User} from "../models/user.js"
import {instance} from "../index.js"
import {Payment} from "../models/Payment.js"
import crypto from "crypto"

export const getAllCourses = TryCatch(async(req,res)=>{
      const courses = await Courses.find();
      res.json({
        courses,
      })
})


export const getSingleCourse = TryCatch(async(req , res)=>{
    const course = await Courses.findById(req.params.id);

    res.json({
        course,
    });
});


export const fetchLectures = TryCatch(async(req , res)=>{
    const lectures = await Lecture.find({course:req.params.id}); // {?}

    const user = await User.findById(req.user._id);

    if(user.role === "admin"){
        return res.json({lectures});
    }

    if(!user.subscription.includes(req.params.id))
        return res.status(400).json({
    message: "You have not subscribed to the course",
        })

    res.json({lectures});
});


export const fetchLecture = TryCatch(async(req , res)=>{
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if(user.role === "admin"){
        return res.json({lecture});
    }

    if(!user.subscription.includes(lecture.course)) // checking if user has subscribed to the course of this lecture
        return res.status(400).json({
    message: "You have not subscribed to the course",
        })

    res.json({lecture});
});

export const getMyCourses= TryCatch(async(req , res)=>{
    const courses = await Courses.find({_id:req.user.subscription}); // using id of user finding all courses in subscription

    res.json({
        courses,
    });
});


export const checkout = TryCatch(async(req , res)=>{ // for payment
    const user = await User.findById(req.user._id); // finding user
    const course = await Courses.findById(req.params.id); // finding course

    if(user.subscription.includes(course._id)){
        return res.status(400).json({ 
            message: "Already subscribed to the course",
        });
    }

    // if not subscribed this course
    const options = {
        amount: Number(course.price *100), // razapay only take number 
        currency: "INR",
    }

    const order = await instance.orders.create(options); // creating order
    res.status(200).json({
        order,
        course,
    })
});

//payment verification
export const  paymentVerification = TryCatch(async(req , res)=>{
     const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

     const body = razorpay_order_id + "|" + razorpay_payment_id;

     const expectedSignature = crypto.createHmac("sha256",
         process.env.RAZORPAY_SECRET
        ).update(body).digest("hex"); 

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const user = await User.findById(req.user._id); // finding user

      const course = await Courses.findById(req.params.id); // finding course

      user.subscription.push(course._id); // pushing course id in subscription

        await user.save(); // saving user

        res.status(200).json({
            message: "Course Purchased Successfully",
        });
    }else{
        res.status(400).json({
            message: "Payment Failed"
        })
    }
        
})