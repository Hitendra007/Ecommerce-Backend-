import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../Controllers/auth.controller.js";
const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)

export default router