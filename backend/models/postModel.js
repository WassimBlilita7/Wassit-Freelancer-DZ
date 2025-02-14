import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    budget: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
        enum: ['short-term', 'long-term', 'ongoing']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur (client) qui a posté l'offre
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'in-progress'],
        default: 'open'
    },
    applications: [{
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Référence à l'utilisateur (freelancer) qui postule
            required: true
        },
        cv: {
            type: String, // Lien vers le CV du freelancer (stocké dans un service de stockage comme AWS S3 ou Cloudinary)
            required: true
        },
        coverLetter: {
            type: String, // Lettre de motivation du freelancer
            required: true
        },
        bidAmount: {
            type: Number, // Montant proposé par le freelancer
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Post = mongoose.model('Post', postSchema);

export default Post;