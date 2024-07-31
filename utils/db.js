import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.DB_URI || "";

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data) => {
            console.log(`Database connected: ${data.connection.host}`);
        });
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
