import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(cookieParser())
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
import UserRouter from './Routes/user.routes.js'
import adminRouter from './Routes/admin.routes.js'
app.use('/api/v1/users',UserRouter)
app.use('/api/v1/admin',adminRouter)
export {app}