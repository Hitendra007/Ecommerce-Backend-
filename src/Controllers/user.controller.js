import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshToken');
  
  res.status(200).json(
    new apiResponse(200, user, 'User profile fetched successfully')
  );
});

const getAllProducts = asyncHandler(async (req, res) => {
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
    .select('-createdBy');

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

export { getUserProfile, getAllProducts };