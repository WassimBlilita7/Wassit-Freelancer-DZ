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
        enum: ['1j', '7j', '15j', '1mois', '3mois', '6mois', '+1an']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur (client) qui a posté l'offre
        required: true
    },
    category: { // Nouveau champ pour la catégorie
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true 
    },
    picture: {
        type: String, // URL to the uploaded image
        default: null
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
        enum: ['open', 'closed', 'in-progress', 'completed'],
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
    }],
    finalization: {
        files: [{
            type: String, // URLs des fichiers
            required: false
        }],
        description: {
            type: String,
            required: false
        },
        submittedAt: {
            type: Date,
            required: false
        },
        acceptedAt: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ['pending', 'submitted', 'completed'],
            default: 'pending'
        }
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;