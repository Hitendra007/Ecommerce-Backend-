import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateProductUrl = (name) => {
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const uniqueId = Math.random().toString(36).substring(2, 7);
  return `${slug}-${uniqueId}`;
};

const createProduct = asyncHandler(async (req, res) => {
  const { 
    name,
    description,
    category,
    startDate,
    freeDelivery,
    deliveryAmount,
    oldPrice,
    newPrice,
    vendorId
  } = req.body;

  if (!vendorId) {
    throw new apiError(400, 'Vendor ID is required');
  }

  const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
  if (!vendor) {
    throw new apiError(404, 'Vendor not found');
  }

  const files = req.files;
  if (!files || files.length === 0) {
    throw new apiError(400, 'At least one product image is required');
  }

  const images = await Promise.all(files.map(async (file) => {
    const result = await uploadOnCloudinary(file.path);
    return result.secure_url;
  }));

  const product = await Product.create({
    name,
    description,
    category,
    startDate,
    expiryDate: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 7)), // ✅ Fixed
    freeDelivery: freeDelivery === 'true',
    deliveryAmount: Number(parseFloat(deliveryAmount).toFixed(2)), // ✅ Fixed
    oldPrice: Number(parseFloat(oldPrice).toFixed(2)), // ✅ Fixed
    newPrice: Number(parseFloat(newPrice).toFixed(2)), // ✅ Fixed
    productURL: generateProductUrl(name),
    vendorId,
    createdBy: req.user._id,
    images
  });

  res.status(201).json(
    new apiResponse(201, product, 'Product created successfully')
  );
});

const getStaffProducts = asyncHandler(async (req, res) => {
  const pageNum = parseInt(req.query.page, 10) || 1;
  const limitNum = parseInt(req.query.limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find({ createdBy: req.user._id })
    .skip(skip)
    .limit(limitNum)
    .populate('vendorId', 'name email');

  const total = await Product.countDocuments({ createdBy: req.user._id });

  res.status(200).json(
    new apiResponse(200, {
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total
    }, 'Staff products fetched successfully')
  );
});

export { createProduct, getStaffProducts };
