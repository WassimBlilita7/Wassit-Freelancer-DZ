import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category
 *         description:
 *           type: string
 *           description: Description of the category
 *         icon:
 *           type: string
 *           description: Icon identifier for the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    icon: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

export default Category;