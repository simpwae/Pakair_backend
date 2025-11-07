import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://simpwae:5712@youp1.pc3ou.mongodb.net/pakair?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri, {
      // These options are no longer needed in Mongoose 6+
      // but keeping them for reference
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
