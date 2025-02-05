import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path:'./.env'
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log('Server Started running on Port 8000')
    })
}).catch((error)=>{
    console.log('Cannot Start server due to error',error)
})
