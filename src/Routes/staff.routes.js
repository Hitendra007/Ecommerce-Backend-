import { Router } from "express";
import { verifyJwt,isAdmin } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { getStaffProducts,createProduct } from "../Controllers/staff.controller.js";
const router = Router()

router.route('/getStaffProducts').get(verifyJwt,getStaffProducts)
router.route('/createStaffProducts').post(verifyJwt,uploadImages,createProduct)




export default router
