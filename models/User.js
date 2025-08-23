// models/User.js
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, minlength: 2 },
    firstName: String,
    lastName: String,
    phone: String,
    dateOfBirth: Date,
    gender: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "US" },
    },
    preferences: {
      categories: [String],
      brands: [String],
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 1000 },
      },
      sizes: [String],
      colors: [String],
    },
    wishlist: [String],
    priceAlerts: [String],
    searchHistory: [String],
    profileImage: String,
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true } // auto adds createdAt & updatedAt
)

// Avoid recompiling model on hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema)
