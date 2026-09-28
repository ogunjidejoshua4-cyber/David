// Line 1: Import mongoose to construct database schemas and models
import mongoose from 'mongoose';

// Line 2: Define Schema for David's dynamic profile details & avatar
const profileSchema = new mongoose.Schema(
  {
    // Line 3: Name of the portfolio owner
    name: { type: String, default: 'David' },
    // Line 4: Cloudinary URL for profile headshot
    avatarUrl: { type: String, default: '' },
    // Line 5: Bio text
    bio: { type: String, default: '' },
  },
  // Line 6: Automatically manage createdAt and updatedAt timestamps
  { timestamps: true }
);

// Line 7: Compile and export the Profile model as the default export
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;