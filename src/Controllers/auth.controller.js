import { User } from "../models/User.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async(req,res,next)=>{
    const {name,email,password,role} = req.body;
    if(!name || !email || !password || !role){
        throw new apiError(400,"Please provide all the fields")
    }
    if(['admin','staff'].includes(role)){
        throw new apiError(403,"You are not allowed to register as an admin or staff")
    }
     const existedUser = await User.find({email})
     if(existedUser){
        throw new apiError(400,"Email already exist !!")
     }
    const user = await User.create({
        name,email,password,role
    })
    const NewUser = await User.findById(user._id).select("-password -refreshToken")
    if(!NewUser){
        throw new apiError(500,"User not created !!")
    }
    res.status(200).json(new apiResponse(200,NewUser,"Created Successfully"))
})



const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new apiError(400, "email & password is required")
    }
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new apiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, 'Password incorrect!')
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, {
            user: loggedInUser, refreshToken, accessToken
        }, "Userlogged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const id = req.user._id;
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true,
    }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options).json(
            new apiResponse(200, {}, "User logged out successfully")
        )

})

export {registerUser,loginUser,logoutUser}