import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import skillRoutes from "./routes/skillRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import statsRoutes from "./routes/statsRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import rateLimitMiddleware from "./middleware/rateLimitMiddleware.js";
import antiDosMiddleware from "./middleware/antiDosMiddleware.js";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger/swagger.js';

const app = express();

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Wassit Freelance API Documentation"
}));

const PORT = ENV_VARS.PORT;
app.use(express.json());
app.use(cookieParser()); 

app.use(passport.initialize());

//app.use(rateLimitMiddleware);
//app.use(antiDosMiddleware);


app.use(
    cors({
      origin:[
        ENV_VARS.VITE_URL,
        ENV_VARS.API_URL,
        "https://www.wassitfreedz.com",
        "https://wassitfreedz.com"
      ],
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
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/ai", aiRoutes);

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
    connectDB();
    });
