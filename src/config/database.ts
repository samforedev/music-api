import mongoose from "mongoose";
import { MONGO_URI } from "../models/constants";

const connectDB = async(): Promise<void> => {
    try {
        const database = await mongoose.connect(MONGO_URI);
        console.log(`✅ Connection to Database: ${database.connection.name} Successfully`);
    } catch (err) {
        console.error("❌ Connection to Database Error", err);
        process.exit(1);
    }
};

export default connectDB;