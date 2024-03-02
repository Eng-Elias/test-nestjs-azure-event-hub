import mongoose from 'mongoose';

export const connectToDatabase = async (uri: string) => {
  try {
    const connection = await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
