import mongoose from "mongoose";

export async function connectDB(){
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);

       console.log("database connected at :", connectionInstance.connection.host)

    } catch (error) {
        console.log("Error while connectin to database:",error);
        throw error;
    }
}

