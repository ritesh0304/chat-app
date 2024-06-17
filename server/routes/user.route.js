import {Router} from 'express'
import { register,login } from '../controllers/user.controller.js'
export const userRoute=Router();
userRoute.post('/register',register)
userRoute.post('/login',login)