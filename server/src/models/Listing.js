import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['textbooks', 'electronics', 'lab-gear', 'stationery', 'dorm', 'giveaways'],
      default: 'stationery'
    },
    listingType: {
      type: String,
      required: [true, 'Please select listing type'],
      enum: ['sell', 'free', 'trade', 'borrow'],
      default: 'sell'
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
    condition: {
      type: String,
      required: [true, 'Please select item condition'],
      enum: ['Like New', 'Good', 'Fair'],
      default: 'Good'
    },
    co2SavedKg: {
      type: Number,
      default: 8.5,
      min: [0, 'Carbon savings cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    },
    tags: {
      type: [String],
      default: []
    },
    seller: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      department: { type: String, default: 'General Studies' },
      year: { type: String, default: 'Junior' },
      avatar: { type: String, default: '' },
      karmaScore: { type: Number, default: 100 },
      itemsReused: { type: Number, default: 0 },
      verifiedStudent: { type: Boolean, default: false }
    },
    location: {
      campusSpot: { type: String, default: 'Main Library 2nd Floor' },
      building: { type: String, default: 'W.E.B. Du Bois Library' },
      safeMeetingZone: { type: Boolean, default: true }
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed'],
      default: 'available'
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

// Virtual field for frontend id alignment
listingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

listingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export default Listing;
