import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!

    if(!MONGO_URI) {
        throw new Error("Connect Data Fail");
    }

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGO_URI);
}