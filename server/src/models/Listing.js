import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must have an owner student account'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters']
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']
    },
    category: {
      type: String,
      required: [true, 'Please select an item category'],
      enum: ['textbooks', 'electronics', 'lab-gear', 'stationery', 'dorm', 'giveaways'],
      default: 'stationery',
      index: true
    },
    condition: {
      type: String,
      required: [true, 'Please select item condition'],
      enum: ['Like New', 'Good', 'Fair'],
      default: 'Good',
      index: true
    },
    listingType: {
      type: String,
      required: [true, 'Please select listing type (Sell, Give Away, or Swap)'],
      enum: ['sell', 'giveaway', 'swap', 'free', 'trade'],
      lowercase: true,
      default: 'sell',
      index: true
    },
    desiredItems: {
      type: String,
      trim: true,
      default: '' // Specified for Swap listings
    },
    sellingPrice: {
      type: Number,
      default: 0,
      min: [0, 'Selling price cannot be negative']
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Original price cannot be negative']
    },
    campus: {
      type: String,
      trim: true,
      default: 'Main Campus'
    },
    location: {
      campusSpot: { type: String, default: 'Main Library 2nd Floor' },
      building: { type: String, default: 'W.E.B. Du Bois Library' },
      safeMeetingZone: { type: Boolean, default: true }
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed'],
      default: 'available',
      index: true
    },
    co2SavedKg: {
      type: Number,
      default: 8.5,
      min: [0, 'Carbon savings cannot be negative']
    },
    tags: {
      type: [String],
      default: []
    },
    seller: {
      id: { type: String },
      name: { type: String },
      department: { type: String, default: 'General Studies' },
      year: { type: String, default: 'Junior' },
      campus: { type: String, default: 'Main Campus' },
      avatar: { type: String, default: '' },
      karmaScore: { type: Number, default: 100 },
      itemsReused: { type: Number, default: 0 },
      isCollegeVerified: { type: Boolean, default: false },
      verifiedStudent: { type: Boolean, default: false }
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Pre-save synchronization: ensure price and sellingPrice match, and normalize listingType
listingSchema.pre('save', function () {
  // Normalize listing types (swap/trade, giveaway/free, sell)
  if (this.listingType === 'trade') this.listingType = 'swap';
  if (this.listingType === 'free') this.listingType = 'giveaway';

  if (this.listingType === 'giveaway' || this.listingType === 'swap') {
    this.sellingPrice = 0;
    this.price = 0;
  } else {
    if (this.sellingPrice && !this.price) this.price = this.sellingPrice;
    if (this.price && !this.sellingPrice) this.sellingPrice = this.price;
  }

  // Ensure images array has at least 1 image and sync with primary imageUrl
  if (!this.images || this.images.length === 0) {
    this.images = ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];
  }
});

// Virtual field for imageUrl
listingSchema.virtual('imageUrl').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

// Virtual field for frontend id alignment
listingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

listingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.imageUrl = ret.images && ret.images.length > 0 ? ret.images[0] : '';
    // Normalize type for UI consistency
    if (ret.listingType === 'giveaway') ret.listingType = 'free';
    if (ret.listingType === 'swap') ret.listingType = 'trade';
    delete ret.__v;
    return ret;
  }
});

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export default Listing;
