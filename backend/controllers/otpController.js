import nodemailer from 'nodemailer';
import { ENV_VARS } from '../config/envVars.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENV_VARS.EMAIL_USER,
        pass : ENV_VARS.EMAIL_PASS,
    },
});

export const sendOTP = async (email, otp) => {
    const mailOptions = {
        from : ENV_VARS.EMAIL_USER,
        to : email,
        subject : 'Votre code de vérification',
        text : `Votre code de vérification est : ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};