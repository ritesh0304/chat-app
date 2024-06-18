import {Router} from 'express'
import { register,login, setAvatar,getAllUsers } from '../controllers/user.controller.js'
export const userRoute=Router();
userRoute.post('/register',register)
userRoute.post('/login',login)
userRoute.post('/setAvatar/:id',setAvatar);
userRoute.get("/allusers/:id", getAllUsers);