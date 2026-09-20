import { log } from "node:console";
import app from "./src/index.js";
import mongoose from "mongoose";
import "dotenv/config";
(async () => {
    
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }
   await mongoose.connect(process.env.DATABASE_URL);
})().then(() => {
    log("Connected to MongoDB!");
    app.listen(3000, () => log("Serving at http://localhost:3000/"));
})
.catch((error) => {
     log("Database connection failed:", error.message);
     process.exitCode = 1;
});

