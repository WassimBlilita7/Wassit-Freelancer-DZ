import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Skill'
        }],
        companyName: { type: String },
        webSite: { type: String },
    }
});

const User = mongoose.model('User', userSchema);

export default User;