import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: "./backend/.env" });

export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,
    JWT_SECRET : process.env.JWT_SECRET,
    VITE_URL : process.env.VITE_URL,
    API_URL : process.env.API_URL,
    EMAIL_USER : process.env.EMAIL_USER,


}; 