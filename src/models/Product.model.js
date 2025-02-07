import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    freeDelivery: {
        type: Boolean,
        default: false
    },
    deliveryAmount: {
        type: Number,
        default: 0,
        set: v => Number(parseFloat(v).toFixed(2)) // Ensure Number type with 2 decimal places
    },
    images: [{
        type: String,
        required: true
    }],
    oldPrice: {
        type: Number,
        required: true,
        set: v => Number(parseFloat(v).toFixed(2)) // Ensure Number type with 2 decimal places
    },
    newPrice: {
        type: Number,
        required: true,
        set: v => Number(parseFloat(v).toFixed(2)) // Ensure Number type with 2 decimal places
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productURL: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

productSchema.pre('save', function (next) {
    if (!this.expiryDate) {
        this.expiryDate = new Date(this.startDate);
        this.expiryDate.setDate(this.expiryDate.getDate() + 7);
    }
    next();
});

productSchema.virtual('discountPercentage').get(function () {
    return parseFloat(((1 - this.newPrice / this.oldPrice) * 100).toFixed(2));
});

productSchema.virtual('discountAmount').get(function () {
    return parseFloat((this.oldPrice - this.newPrice).toFixed(2));
});

const Product = mongoose.model('Product', productSchema);
export { Product };
