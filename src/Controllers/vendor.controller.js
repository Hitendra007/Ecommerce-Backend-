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

const createVendorProduct = asyncHandler(async (req, res) => {
  const { 
    name,
    description,
    category,
    startDate,
    freeDelivery,
    deliveryAmount,
    oldPrice,
    newPrice
  } = req.body;

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
    expiryDate: new Date(startDate).setDate(new Date(startDate).getDate() + 7),
    freeDelivery: freeDelivery === 'true',
    deliveryAmount: deliveryAmount ? parseFloat(deliveryAmount).toFixed(2) : 0,
    oldPrice: parseFloat(oldPrice).toFixed(2),
    newPrice: parseFloat(newPrice).toFixed(2),
    productURL: generateProductUrl(name),
    vendorId: req.user._id,
    createdBy: req.user._id,
    images
  });

  res.status(201).json(
    new apiResponse(201, product, 'Product created successfully')
  );
});

const getVendorProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const products = await Product.find({ vendorId: req.user._id })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments({ vendorId: req.user._id });

  res.status(200).json(
    new apiResponse(200, {
      products,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    }, 'Vendor products fetched successfully')
  );
});

export { createVendorProduct, getVendorProducts };