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

        if(post.status === "accepted") {
            return res.status(400).json({message: "Cette offre est déjà acceptée. Vous ne pouvez pas postuler"});
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

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const {title,description,skillsRequired,budget,duration} = req.body;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Offre non trouvée"});
        }

        if(post.client.toString() !== req.user.id) {
            return res.status(401).json({message: "Vous n'êtes pas autorisé à modifier cette offre"});
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.skillsRequired = skillsRequired || post.skillsRequired;
        post.budget = budget || post.budget;
        post.duration = duration || post.duration;

        await post.save();

        res.status(200).json({message: "Offre mise à jour avec succès" , post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: "Offre non trouvée"});
        }

        if(post.client.toString() !== req.user.id) {
            return res.status(401).json({message: "Vous n'êtes pas autorisé à supprimer cette offre"});
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: "Offre supprimée avec succès"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const postId = req.params.postId;
        const applicationId = req.params.applicationId;
        const {status} = req.body;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Offre non trouvée"});
        }

        if(post.client.toString() !== req.user.id) {
            return res.status(401).json({message: "Vous n'êtes pas autorisé à modifier cette offre"});
        }

        const application = post.applications.id(applicationId) ;
        if(!application) {
            return res.status(404).json({message: "Application non trouvée"});
        }

        application.status = status || application.status;

        await post.save();

        res.status(200).json({message: "Statut de l'application mis à jour avec succès" , post});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateFreelancerApplication = async (req, res) => {
    try {
        const postId = req.params.postId;
        const applicationId = req.params.applicationId;
        const {cv,coverLetter,bidAmount} = req.body;
        const freelancerId = req.user.id;


        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message: "Offre non trouvée"});
        }

        const application = post.applications.id(applicationId);

        if(!application) {
            return res.status(404).json({message: "Application non trouvée"});
        }

        if(application.freelancer.toString() !== freelancerId) {
            return res.status(401).json({message: "Vous n'êtes pas autorisé à modifier cette application"});
        }

        application.cv = cv || application.cv;
        application.coverLetter = coverLetter || application.coverLetter;
        application.bidAmount = bidAmount || application.bidAmount;

        await post.save();

        res.status(200).json({message: "Application mise à jour avec succès" , post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};