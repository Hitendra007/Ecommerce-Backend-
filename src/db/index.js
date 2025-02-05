import mongoose from "mongoose";
import { dbname } from "../constants.js";
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MongoDb connection failed',error)
        process.exit(1)
    }
}

export default connectDB