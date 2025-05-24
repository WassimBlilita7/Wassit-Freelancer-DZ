import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - isFreelancer
 *       properties:
 *         username:
 *           type: string
 *           minLength: 5
 *           maxLength: 20
 *           description: Unique username for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password (required for non-OAuth users)
 *         isOAuthUser:
 *           type: boolean
 *           default: false
 *           description: Whether the user signed up through OAuth
 *         isFreelancer:
 *           type: boolean
 *           description: Whether the user is a freelancer
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Whether the user's email is verified
 *         profile:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             bio:
 *               type: string
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 *             companyName:
 *               type: string
 *             webSite:
 *               type: string
 *             profilePicture:
 *               type: string
 *             github:
 *               type: string
 *             linkedIn:
 *               type: string
 */

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        lowercase : true,
        trim : true
    },
    password: {
        type: String,
        required: function() {
            return !this.isOAuthUser; // Requis seulement pour les non-OAuth
        }
    },
    isOAuthUser: {
        type: Boolean,
        default: false
    },
    isFreelancer: {
        type: Boolean,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        bio: { type: String },
        skills: [{
            type: String,
            trim: true
        }],
        companyName: { type: String },
        webSite: { type: String },
        profilePicture: { type: String, default: "" },
        github: { type: String },
        linkedIn: { type: String },
    },
    notifications: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
    }],
    resetOTP: {
        type: String,
    },
    resetOTPExpires: {
        type: Date,
    },
});

const User = mongoose.model('User', userSchema);

export default User;