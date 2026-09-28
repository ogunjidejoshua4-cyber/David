// Line 1: Import mongoose to construct database schemas
import mongoose from 'mongoose';

// Line 2: Define Schema for David's showcase works
const projectSchema = new mongoose.Schema(
  {
    // Line 3: Title of project or book
    title: { type: String, required: true, trim: true },
    // Line 4: Client or author name
    authorName: { type: String, required: true, trim: true },
    // Line 5: Selected creative service (e.g., Book Cover Design, Book Trailers)
    genre: { type: String, required: true },
    // Line 6: Short design summary or notes
    description: { type: String, default: '' },
    // Line 7: Cloudinary secure image URL
    coverImageUrl: { type: String, required: true },
  },
  // Line 8: Automatically manage createdAt and updatedAt timestamps
  { timestamps: true }
);

// Line 9: Export compiled Mongoose model
export default mongoose.model('Project', projectSchema);