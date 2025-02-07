import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import mongoose from "mongoose";

const generateProductUrl = (name) => {
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const uniqueId = Math.random().toString(36).substring(2, 7);
  return `${slug}-${uniqueId}`;
};

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken');
  res.status(200).json(new apiResponse(200, users, 'All users fetched'));
});

const getVendors = asyncHandler(async (req, res) => {
  const vendors = await User.find({ role: 'vendor' }).select('-password -refreshToken');
  res.status(200).json(new apiResponse(200, vendors, 'All vendors fetched'));
});

const getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: 'staff' }).select('-password -refreshToken');
  res.status(200).json(new apiResponse(200, staff, 'All staff members fetched'));
});

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new apiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apiError(409, 'User with this email already exists');
  }

  const staff = await User.create({
    name,
    email,
    password,
    role: 'staff'
  });

  res.status(201).json(
    new apiResponse(201, staff, 'Staff account created successfully')
  );
});

// Product Management
const adminCreateProduct = asyncHandler(async (req, res) => {
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

  // Validate vendorId
  if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new apiError(400, 'Valid vendor ID is required');
  }

  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== 'vendor') {
    throw new apiError(404, 'Vendor not found');
  }

  // Validate images
  const files = req.files;
  if (!files || files.length === 0) {
    throw new apiError(400, 'At least one product image is required');
  }

  // Upload images to Cloudinary
  const images = await Promise.all(files.map(async (file) => {
    const result = await uploadOnCloudinary(file.path);
    return result.secure_url;
  }));

  // Create product
  const product = await Product.create({
    name,
    description,
    category,
    startDate,
    expiryDate: new Date(startDate).setDate(new Date(startDate).getDate() + 7), // Calculate expiry date
    freeDelivery: freeDelivery === 'true',
    deliveryAmount: deliveryAmount ? Number(parseFloat(deliveryAmount).toFixed(2)) : 0, // Ensure correct number format
    oldPrice: Number(parseFloat(oldPrice).toFixed(2)), // Ensure correct number format
    newPrice: Number(parseFloat(newPrice).toFixed(2)), // Ensure correct number format
    productURL: generateProductUrl(name), // Generate product URL
    vendorId,
    createdBy: req.user._id,
    images
  });

  res.status(201).json(
    new apiResponse(201, product, 'Product created successfully by admin')
  );
});

const adminGetAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('vendorId', 'name email')
    .populate('createdBy', 'name role');

  const total = await Product.countDocuments(query);

  res.status(200).json(
    new apiResponse(200, {
      products,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    }, 'All products fetched successfully')
  );
});

const adminUpdateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const files = req.files;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, 'Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new apiError(404, 'Product not found');
  }

  if (files && files.length > 0) {
    const images = await Promise.all(files.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return result.secure_url;
    }));
    updateData.images = images;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new apiResponse(200, updatedProduct, 'Product updated successfully')
  );
});

const adminDeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, 'Invalid product ID');
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new apiError(404, 'Product not found');
  }

  res.status(200).json(
    new apiResponse(200, null, 'Product deleted successfully')
  );
});

export {
  getAllUsers,
  getVendors,
  getStaff,
  createStaff,
  adminCreateProduct,
  adminGetAllProducts,
  adminUpdateProduct,
  adminDeleteProduct
};