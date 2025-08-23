import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-()]+$/, "Invalid phone number format"],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "US",
      },
    },
    preferences: {
      categories: [
        {
          type: String,
        },
      ],
      brands: [
        {
          type: String,
        },
      ],
      priceRange: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 1000,
        },
      },
      sizes: [
        {
          type: String,
        },
      ],
      colors: [
        {
          type: String,
        },
      ],
    },
    wishlist: [
      {
        productId: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    priceAlerts: [
      {
        productId: String,
        targetPrice: Number,
        isActive: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    searchHistory: [
      {
        query: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    profileImage: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  },
)

userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

export default mongoose.models.User || mongoose.model("User", userSchema)
