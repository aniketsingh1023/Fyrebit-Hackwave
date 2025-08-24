import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: { type: String },
  discountedPrice: { type: String },
  price: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  source: { type: String },
})

const trendsSchema = new mongoose.Schema(
  {
    searchQuery: { type: String, required: true, unique: true },
    products: { type: [productSchema], default: [] },
  },
  { timestamps: true }
)

// ✅ Prevent OverwriteModelError in dev/hot-reload
const Trends = mongoose.models.Trends || mongoose.model("Trends", trendsSchema)

export default Trends
