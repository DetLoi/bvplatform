const mongoose = require('mongoose');
const { seedDatabase } = require('./src/utils/comprehensive-seeder.cjs');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the same MongoDB URI as the main server
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://spkzdloi:btTDAPh0XXhiURtb@breakverse.p9k1nq1.mongodb.net/?retryWrites=true&w=majority&appName=breakverse';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
} 