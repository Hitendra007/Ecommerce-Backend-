import { Router } from "express";
import { verifyJwt,isAdmin } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../Controllers/admin.controller.js";


const router = Router()

router.route('/getAllUsers').get(verifyJwt,isAdmin,getAllUsers)
export default router