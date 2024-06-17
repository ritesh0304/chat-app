import { User } from "../model/user.model.js";
import bcrypt, { compareSync } from 'bcrypt'

export const login=async (req,res,next)=>{
  try {
      const {email, password}=req.body;
      const emailCheck=await User.findOne({"email":email});
      if(!emailCheck){
        return res.json({
            msg:"email doesn't exist",
            status:false,
        })
      }
      const user=await User.findOne({"email":email});
      const isValidPassword=await user.isPasswordCheck(password);

      if(!isValidPassword){
        return res.json(
          {
            msg:"wrong password",
            status:false
          }
        )
      }
      // delete user.password;
      const existedUser=await User.findOne({"email":email}).select("-password");
      console.log(existedUser);
      return res.json({status:true,existedUser})
  } catch (error) {
    next(error)
  }
  }
export const register=async (req,res)=>{
try {
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
} catch (error) {
  next(error)
}
}