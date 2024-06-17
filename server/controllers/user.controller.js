import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt'


export const register=async (req,res)=>{
  const {username, email, password}=req.body;
  const usernameCheck= await User.findOne({username})
  if(usernameCheck){
    return res.json({
        msg:"username already exist",
        status:false,
    })
  }
  const emailCheck=await User.findOne({"email":email});
  if(emailCheck){
    return res.json({
        msg:"email already exist",
        status:false,
    })
  }
  const user=await User.create({
    username,
    email,
    password
  })
  const existedUser=await User.findById(user._id).select("-password")
  console.log(existedUser);
  return res.json({status:true,existedUser})
}