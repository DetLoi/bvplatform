import mongoose from 'mongoose';
import User from './src/models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const fixImageUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};
      
      // Fix profile image URL
      if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
        updates.profileImage = `http://localhost:5000${user.profileImage}`;
        needsUpdate = true;
        console.log(`Fixing profile image for ${user.username}: ${user.profileImage} -> ${updates.profileImage}`);
      }
      
      // Fix cover image URL
      if (user.coverImage && user.coverImage.startsWith('/uploads/')) {
        updates.coverImage = `http://localhost:5000${user.coverImage}`;
        needsUpdate = true;
        console.log(`Fixing cover image for ${user.username}: ${user.coverImage} -> ${updates.coverImage}`);
      }
      
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImageUrls(); 