/**
 * Launch Music-API
 */
import dotenv from "dotenv";
import path from "path";
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(__dirname,"..", envFile) });

import app from "./app";
import connectDB from "./config/database";
import { PORT } from "./models/constants";

connectDB().then( );
app.listen(PORT, () => {
    console.log(`🚀 App listening on ${PORT}`);
})
