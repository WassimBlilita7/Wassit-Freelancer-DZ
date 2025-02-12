import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";

const app = express();


const PORT = ENV_VARS.PORT;
app.use(express.json());

app.use("/api/v1/auth",authRoutes);



app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}`);
    connectDB();
    });