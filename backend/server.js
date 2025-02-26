import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import skillRoutes from "./routes/skillRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();


const PORT = ENV_VARS.PORT;
app.use(express.json());
app.use(cookieParser()); 

app.use(passport.initialize());

app.use(
    cors({
      origin: "http://46.202.131.115", // Port par défaut de Vite
      credentials: true,
    })
  );

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/review",reviewRoutes);
app.use("/api/v1/message",messageRoutes);
app.use("/api/v1/skill",skillRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/notification",notificationRoutes);


app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
    connectDB();
    });
