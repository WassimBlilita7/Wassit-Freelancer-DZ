import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {

    try {
        const {title , description , skillsRequired , budget , duration} = req.body;
        const clientId = req.user.id;

        const client = await User.findById(clientId);

        if(!title || !description || !skillsRequired || !budget || !duration) {
            return res.status(400).json({message: "Veuillez remplir tous les champs"});
        }

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

export const getAllPosts = async (req, res) => {

    try {
        const posts = await Post.find({status: "open"}).populate("client", "username email");
        res.status(200).json({posts});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("client", "username email").populate("applications.freelancer", "username email");
        if(!post) {
            return res.status(404).json({message: "Offre non trouvée"});
        }
        res.status(200).json({post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const applyToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const freelancerId = req.user.id;
        const {cv,coverLetter,bidAmount} = req.body;

        const freelancer = await User.findById(freelancerId);
        if(!freelancer || !freelancer.isFreelancer) {
            return res.status(404).json({message: "Seuls les freelancers peuvent postuler"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Offre non trouvée"});
        }

        // si le freelancer a déjà postulé
        const hasApplied = post.applications.find(application => application.freelancer.toString() === freelancerId);
        if(hasApplied) {
            return res.status(400).json({message: "Vous avez déjà postulé à cette offre"});
        }

        post.applications.push({
            freelancer: freelancerId,
            cv,
            coverLetter,
            bidAmount
        });

        await post.save();
        res.status(200).json({message: "Postulé avec succès" , post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

