import Skill from "../models/skillModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

export const createSkill = async (req, res) => {
    const { name, category: categoryName } = req.body; 
    const userId = req.user._id;
  
    try {
      const existingSkill = await Skill.findOne({ name });
      if (existingSkill) {
        return res.status(400).json({ message: "Cette compétence existe déjà" });
      }
  
      if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
        return res.status(400).json({ message: "Veuillez fournir un nom de catégorie valide" });
      }
  
      const category = await Category.findOne({ name: categoryName.trim() });
      if (!category) {
        return res.status(400).json({ message: "La catégorie spécifiée n'existe pas" });
      }
  
      const newSkill = new Skill({
        name,
        category: category._id, 
      });
  
      await newSkill.save();
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      if (!user.isFreelancer) {
        return res.status(400).json({ message: "Seuls les freelances peuvent ajouter des compétences" });
      }
  
      user.profile.skills.push(newSkill._id);
      await user.save();
  
      res.status(201).json(newSkill);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
export const getAllSkills = async (req, res)=>{
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);

    } catch (error) {
        res.status(500).json({message : "Serveur Erreur"})
    }
};

export const getSkillById = async (req, res)=>{
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalid" });
        }

        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill non trouvée" });
        }

        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({message : "Erreur Serveur"})
    }
};

export const updateSkill = async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalid" });
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            id,
            { name, category },
            { new: true } // Retourne le document mis à jour
        );

        if (!updatedSkill) {
            return res.status(404).json({ message: "Skill non trouvée" });
        }

        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({ message: "Erreur Serveur", error: error.message });
    }
};

export const deleteSkill = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalid" });
        }

        const deletedSkill = await Skill.findByIdAndDelete(id);
        if (!deletedSkill) {
            return res.status(404).json({ message: "Skill non trouvée" });
        }

        await User.updateMany(
            { "profile.skills": id },
            { $pull: { "profile.skills": id } }
        );

        res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};