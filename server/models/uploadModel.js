//uploadModel.js
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf: {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
  },
}, { timestamps: true });

export default mongoose.model('Upload', uploadSchema);
