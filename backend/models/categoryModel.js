import mongoose from "mongoose";

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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;