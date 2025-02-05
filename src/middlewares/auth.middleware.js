import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/User.model";
import jwt from 'jsonwebtoken';
const verifyJwt = asyncHandler(async(req,_,next)=>{
    const token  = req.cookies.token || req.headers("Authorization").split(" ")[1];
    if(!token){
        throw new apiError(401,"Unauthorized")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    if(!user){
        throw new apiError(401,"Invalid User")
    }
    req.body.user = user;
    next();
})