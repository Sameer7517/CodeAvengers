import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const exchangeRequestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Target listing is required'],
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing owner is required'],
      index: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester student is required'],
      index: true
    },
    type: {
      type: String,
      enum: ['swap', 'giveaway', 'sell'],
      required: [true, 'Request exchange type is required'],
      index: true
    },
    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null // Required for swap requests
    },
    proposedMeetingTime: {
      type: String,
      required: [true, 'Proposed meeting time is required'],
      trim: true
    },
    proposedSpot: {
      type: String,
      default: 'Campus Safe Zone - Main Library 2nd Floor',
      trim: true
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
      index: true
    },
    ownerConfirmedHandover: {
      type: Boolean,
      default: false
    },
    requesterConfirmedHandover: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    },
    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);

// Compound index to help query active requests per listing/requester
exchangeRequestSchema.index({ listing: 1, requester: 1, status: 1 });

export const ExchangeRequest = mongoose.models.ExchangeRequest || mongoose.model('ExchangeRequest', exchangeRequestSchema);
