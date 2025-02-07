import { Router } from "express";
import { verifyJwt,isAdmin } from "../middlewares/auth.middleware.js";
import { getAllUsers,getVendors,getStaff,adminCreateProduct,adminDeleteProduct,adminGetAllProducts,adminUpdateProduct,createStaff} from "../Controllers/admin.controller.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/getAllUsers').get(verifyJwt,isAdmin,getAllUsers)
router.route('/getVendors').get(verifyJwt,isAdmin,getVendors)
router.route('/adminGetAllProducts').get(verifyJwt,isAdmin,adminGetAllProducts)
router.route('/getStaff').get(verifyJwt,isAdmin,getStaff)
router.route('/createStaff').post(verifyJwt,isAdmin,createStaff)
router.route('/adminCreateProduct').post(verifyJwt,isAdmin,uploadImages,adminCreateProduct)
router.route('/adminUpdateProduct/:id').patch(verifyJwt,isAdmin,uploadImages,adminUpdateProduct)
router.route('/adminDeleteProduct/:id').delete(verifyJwt,isAdmin,adminDeleteProduct)


export default router