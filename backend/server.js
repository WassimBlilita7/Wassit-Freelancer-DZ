import express from "express";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { configureGoogleAuth } from "./config/googleAuthConfig.js";
const app = express();


const PORT = ENV_VARS.PORT;
app.use(express.json());
app.use(cookieParser()); 
app.use(passport.initialize());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/review",reviewRoutes);
app.use("/api/v1/message",messageRoutes);


app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
    connectDB();
    });