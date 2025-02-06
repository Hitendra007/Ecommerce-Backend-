import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import jwt from 'jsonwebtoken';
const verifyJwt = asyncHandler(async(req,_,next)=>{
    const token  = req.cookies.accessToken || req?.headers["Authorization"].split(" ")[1];
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

const isAdmin = asyncHandler(async(req,res,next)=>{
      const role = req.body?.user?.role;
      if(!role){
        throw new apiError(500,'not Authorized!!')
      }
      if(role !=='admin')
      {
        throw new apiError(401,'Not a admin')
      }
      next()
})

export {verifyJwt,isAdmin}