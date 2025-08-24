import mongoose from 'mongoose'

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  analysis: {
    suggestedSearch: String,
    confidence: Number,
    category: String,
    subcategory: String,
    colors: [String],
    tags: [String]
  },
  scrapedProducts: [{
    name: String,
    price: String,
    image: String,
    link: String,
    source: String
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.models.Upload || mongoose.model('Upload', uploadSchema)
