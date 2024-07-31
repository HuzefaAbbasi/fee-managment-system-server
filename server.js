import { app } from "./app.js";
// import connectDB from "./utils/db.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});
