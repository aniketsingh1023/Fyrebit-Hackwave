// lib/models/Upload.js
import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  userId: String,
  originalName: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  fileSize: Number,
  uploadedAt: Date,
  analysis: Object,
});

export default mongoose.models.Upload || mongoose.model("Upload", UploadSchema);
