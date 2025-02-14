import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {

    try {
        const {title , description , skillsRequired , budget , duration} = req.body;
        const clientId = req.user.id;

        const client = await User.findById(clientId);

        if(!client || client.isFreelancer) {
            return res.status(404).json({message: "Seuls les clients peuvent créer des offres"});
        }

        const newPost = new Post({
            title,
            description,
            skillsRequired,
            budget,
            duration,
            client: clientId
        });

        await newPost.save();
        res.status(201).json({message: "Offre créée avec succès" , post: newPost});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};