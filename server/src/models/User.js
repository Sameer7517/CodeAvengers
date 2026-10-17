import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Validates whether an email domain corresponds to an accredited academic/college institution.
 * Supported: .edu, .ac.uk, .edu.in, .ac.in, .edu.*, .ac.*, or campus.edu
 */
export const checkCollegeDomain = (email) => {
  if (!email || typeof email !== 'string') return false;
  const lower = email.trim().toLowerCase();
  const collegeDomainRegex = /@([a-zA-Z0-9-]+\.)*(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/i;
  return collegeDomainRegex.test(lower) || lower.endsWith('@campus.edu');
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your campus or student email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Exclude from query results by default
    },
    department: {
      type: String,
      trim: true,
      default: 'General Studies'
    },
    year: {
      type: String,
      default: 'Junior (3rd Year)'
    },
    campus: {
      type: String,
      default: 'Main Campus'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    karmaScore: {
      type: Number,
      default: 100
    },
    itemsReused: {
      type: Number,
      default: 0
    },
    co2DivertedKg: {
      type: Number,
      default: 0
    },
    dollarsSaved: {
      type: Number,
      default: 0
    },
    // Explicit College Verification fields
    isCollegeVerified: {
      type: Boolean,
      default: false
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'unverified'
    },
    verificationMethod: {
      type: String,
      enum: ['none', 'institutional_email', 'student_id_code', 'admin_approved'],
      default: 'none'
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    badges: [
      {
        title: String,
        icon: String,
        desc: String
      }
    ],
    savedItems: [
      {
        type: String // Item ID reference
      }
    ]
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password and execute college verification check
userSchema.pre('save', async function () {
  // If email was modified or document is new, evaluate college verification
  if (this.isModified('email')) {
    if (checkCollegeDomain(this.email)) {
      this.isCollegeVerified = true;
      this.verificationStatus = 'verified';
      this.verificationMethod = 'institutional_email';
      this.verifiedAt = new Date();
    } else {
      // Non-college email addresses are explicitly marked unverified
      this.isCollegeVerified = false;
      this.verificationStatus = 'unverified';
      this.verificationMethod = 'none';
      this.verifiedAt = null;
    }
  }

  // Hash password if modified
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
