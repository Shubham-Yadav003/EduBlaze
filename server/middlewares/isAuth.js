import jwt from "jsonwebtoken";
import {user as User} from "../models/user.js";

export const isAuth = async(req , res , next)=>{
    try{
         const token = req.headers.token; // token from header is taken
            
         if(!token){
                return res.status(401).json({
                    message:"Unauthorized user"
                })
            }

        const decodedData = jwt.verify(token, process.env.Jwt_Sec); // token is verified using secret key{?? why}
        req.user = await User.findById(decodedData._id)
        next();
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
};

export const isAdmin =(req,res,next)=>{
    try{
         if(req.user.role !== "admin"){
            return res.status(403).json({ //403 unauthorized
                message:"Yor are not admin"
            })
         }

         next();




    } catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}