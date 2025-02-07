import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getUserProfile, getAllProducts } from "../Controllers/user.controller.js";

const router = Router();

router.route('/getProfile').get(verifyJwt, getUserProfile);

router.route('/getAllProducts').get(getAllProducts);

export default router;
