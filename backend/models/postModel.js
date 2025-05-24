import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - budget
 *         - category
 *         - client
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the post
 *         description:
 *           type: string
 *           description: Detailed description of the post
 *         budget:
 *           type: number
 *           description: Budget for the project
 *         category:
 *           type: string
 *           description: Category of the post
 *         client:
 *           type: string
 *           description: ID of the client who created the post
 *         status:
 *           type: string
 *           enum: [open, in-progress, completed, cancelled]
 *           default: open
 *           description: Current status of the post
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Required skills for the project
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of attached files
 *         offers:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of offers made on this post
 *         selectedOffer:
 *           type: string
 *           description: ID of the selected offer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

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
        min: 0
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
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;