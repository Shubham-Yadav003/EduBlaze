import { user as User } from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/tryCatch.js";



export const register = TryCatch(async (req, res) => {
    const { email, name, password } = req.body;
  
    let user = await User.findOne({ email });
  
    if (user)
      return res.status(400).json({
        message: "User Already exists",
      });
  
    const hashPassword = await bcrypt.hash(password, 10);
  
    user = {
      name,
      email,
      password: hashPassword,
    };
  
    const otp = Math.floor(Math.random() * 1000000);
  
    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Activation_Secret,
      {
        expiresIn: "5m",
      }
    );
  
    const data = {
      name,
      otp,
    };
  
    await sendMail(email, "E learning", data);
  
    res.status(200).json({
      message: "Otp send to your mail",
      activationToken,
    });
  });
  // register controller will send otp for 2nd half of reg verify is used using that otp


  export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;
  
    const verify = jwt.verify(activationToken, process.env.Activation_Secret);
  
    if (!verify)
      return res.status(400).json({
        message: "Otp Expired",
      });
  
    if (verify.otp !== otp)
      return res.status(400).json({
        message: "Wrong Otp",
      });
  
    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.password,
    });
  
    res.json({
      message: "User Registered",
    });
  });



//login
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ //400 bad request
            message: "User not found"
        })
    }
    const matchPassword = await bcrypt.compare(password, user.password); // comparing password

    if (!matchPassword) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    // if user and password both present
    // generate token then
    const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, { expiresIn: "15d" }); // 15 days token

    //after generating token 
    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user,
    })


})

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id) // need middleware here
    res.json({ user });
});