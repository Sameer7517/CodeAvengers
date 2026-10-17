import mongoose from 'mongoose';

const participantConsentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: { type: String, default: '' },
    userAvatar: { type: String, default: '' },
    userDepartment: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    respondedAt: { type: Date },
    note: { type: String, default: '' }
  },
  { _id: false }
);

const proposalStepSchema = new mongoose.Schema(
  {
    fromUserId: { type: String, required: true },
    fromUserName: { type: String, required: true },
    fromUserAvatar: { type: String, default: '' },
    toUserId: { type: String, required: true },
    toUserName: { type: String, required: true },
    toUserAvatar: { type: String, default: '' },
    itemId: { type: String, required: true },
    itemTitle: { type: String, required: true },
    itemCategory: { type: String, default: '' },
    itemImageUrl: { type: String, default: '' },
    itemCo2Kg: { type: Number, default: 0 },
    matchReason: { type: String, default: '' },
    handoverConfirmed: { type: Boolean, default: false },
    handoverConfirmedAt: { type: Date }
  },
  { _id: false }
);

const circularProposalSchema = new mongoose.Schema(
  {
    cycleType: {
      type: String,
      enum: ['2-way', '3-way', 'multi-way'],
      default: '3-way'
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
      }
    ],
    steps: [proposalStepSchema],
    consents: [participantConsentSchema],
    status: {
      type: String,
      enum: ['suggested', 'pending_consent', 'confirmed', 'completed', 'declined', 'expired'],
      default: 'pending_consent',
      index: true
    },
    totalCo2SavedKg: {
      type: Number,
      default: 0
    },
    totalDollarsSaved: {
      type: Number,
      default: 0
    },
    revalidationError: {
      type: String,
      default: ''
    },
    summaryText: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

circularProposalSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

circularProposalSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const CircularProposal = mongoose.models.CircularProposal || mongoose.model('CircularProposal', circularProposalSchema);
export default CircularProposal;
