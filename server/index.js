import express from 'express'
import cors from "cors";
import dotenv from "dotenv"
import { connectDB } from './db/index.js';
import { userRoute } from './routes/user.route.js';

dotenv.config({
    path:'./.env'
})

const app=express();
app.use(cors({
    origin: '*', // Adjust to your frontend origin
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',userRoute);
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is working at PORT: " ,process.env.PORT)
    })
})

