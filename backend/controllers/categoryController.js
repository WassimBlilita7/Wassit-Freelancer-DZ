import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

export const createCategory = async (req, res) => {
    try {
        const {name} = req.body;
        const existingCategory = await Category.findOne({name});
        if (existingCategory) {
            return res.status(400).json({message: "Cette catégorie existe déjà"});
        }

        const newCategory = new Category({
            name,
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({message: "Catégorie introuvable"});
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({message: "Catégorie introuvable"});
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Catégorie non trouvée" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Retourne le document mis à jour
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Categorie non trouvée" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid " });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json({ message: "Catégorie est supprimée avec succées" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};