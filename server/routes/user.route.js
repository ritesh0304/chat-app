import {Router} from 'express'
import { register } from '../controllers/user.controller.js'
export const userRoute=Router();
userRoute.post('/register',register)