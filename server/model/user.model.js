import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:3,
        max:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        min:3,
        max:20,
    },
    password:{
        type:String,
        required:true,
        min:8,
        max:20,
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false,
    },
    avatarImage:{
        type:String,
        default:""
    }
},{
timestamps:true,
})
userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})
export const User=mongoose.model("User",userSchema);