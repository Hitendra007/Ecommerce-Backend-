import { Router } from "express";
import { verifyJwt} from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { createVendorProduct, getVendorProducts } from "../Controllers/vendor.controller.js";

const router = Router();

router.route('/getVendorProducts').get(verifyJwt, getVendorProducts);

router.route('/createVendorProduct').post(verifyJwt,uploadImages, createVendorProduct);

export default router;
