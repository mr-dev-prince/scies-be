import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, { dbName: "SCIES" });
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting database", error);
  }
};
