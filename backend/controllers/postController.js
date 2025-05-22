import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    try {
      const { title, description, skillsRequired, budget, duration, category: categoryInput } = req.body;
      const clientId = req.user.id;
      const picture = req.file ? req.file.path : null; // Cloudinary URL
  
      if (!title || !description || !skillsRequired || !budget || !duration || !categoryInput) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs, y compris la catégorie" });
      }
  
      const client = await User.findById(clientId);
      if (!client || client.isFreelancer) {
        return res.status(404).json({ message: "Seuls les clients peuvent créer des offres" });
      }
  
      let categoryId;
      if (mongoose.Types.ObjectId.isValid(categoryInput)) {
        const categoryExists = await Category.findById(categoryInput);
        if (!categoryExists) {
          return res.status(400).json({ message: "L'ID de la catégorie spécifiée n'existe pas" });
        }
        categoryId = categoryInput;
      } else {
        const category = await Category.findOne({ name: categoryInput.trim() });
        if (!category) {
          return res.status(400).json({ message: "La catégorie spécifiée n'existe pas" });
        }
        categoryId = category._id;
      }
  
      const newPost = new Post({
        title,
        description,
        skillsRequired,
        budget,
        duration,
        client: clientId,
        category: categoryId,
        picture // Add picture URL
      });
  
      await newPost.save();
      res.status(201).json({ message: "Offre créée avec succès", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };

  export const getAllPosts = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      let posts;
      const { random } = req.query; // Nouveau paramètre de requête
  
      if (user.isFreelancer) {
        // Freelancers voient toutes les offres ouvertes
        if (random === 'true') {
          // Retourner 3 offres aléatoires
          posts = await Post.aggregate([
            { $match: { status: "open" } },
            { $sample: { size: 3 } }, // MongoDB $sample pour sélection aléatoire
          ]);
          // Populate manuellement car aggregate ne supporte pas populate
          posts = await Post.populate(posts, [
            { path: "client", select: "username email" },
            { path: "category", select: "name" },
          ]);
        } else {
          posts = await Post.find({ status: "open" })
            .populate("client", "username email")
            .populate("category", "name");
        }
      } else {
        // Clients voient uniquement leurs propres offres
        posts = await Post.find({ client: userId })
          .populate("client", "username email")
          .populate("category", "name");
      }
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
// Backend: Update getPostById in your controller file
export const getPostById = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId)
        .populate("client", "username email")
        .populate("applications.freelancer", "username email")
        .populate("category", "name"); // Add this line to populate category
      if (!post) {
        return res.status(404).json({ message: "Offre non trouvée" });
      }
      res.status(200).json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

export const applyToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const freelancerId = req.user.id;
        const { coverLetter, bidAmount } = req.body;
        const cvFile = req.file; // Récupérer le fichier uploadé

        if (!cvFile) {
            return res.status(400).json({ message: "Veuillez fournir un CV au format PDF" });
        }

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
            cv: cvFile.path, // Utiliser le chemin du fichier uploadé
            coverLetter,
            bidAmount
        });

        await post.save();
        const notification = new Notification({
            recipient: post.client,
            sender: freelancerId,
            post: postId,
            type: "new_application",
            message: `${freelancer.username} a postulé à votre offre "${post.title}"`,
        });

        await notification.save();
        await User.findByIdAndUpdate(post.client, {
            $push: { notifications: notification._id },
        });
        res.status(200).json({message: "Postulé avec succès" , post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, description, skillsRequired, budget, duration } = req.body;
      const picture = req.file ? req.file.path : null;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Offre non trouvée" });
      }
  
      if (post.client.toString() !== req.user.id) {
        return res.status(401).json({ message: "Vous n'êtes pas autorisé à modifier cette offre" });
      }
  
      post.title = title || post.title;
      post.description = description || post.description;
      post.skillsRequired = skillsRequired || post.skillsRequired;
      post.budget = budget || post.budget;
      post.duration = duration || post.duration;
      if (picture) post.picture = picture; // Update picture if provided
  
      await post.save();
      res.status(200).json({ message: "Offre mise à jour avec succès", post });
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

        if (status === "accepted") {
            const notification = new Notification({
              recipient: application.freelancer,
              sender: req.user.id,
              post: postId,
              type: "application_accepted_by_client",
              message: `Vous avez été accepté pour "${post.title}". Suivez l'avancement dans la section Projets.`,
            });
            await notification.save();
      
            // Ajouter la notification au freelancer
            await User.findByIdAndUpdate(application.freelancer, {
              $push: { notifications: notification._id },
            });
          }

        // Recharger le post avec le populate pour applications.freelancer
        const populatedPost = await Post.findById(postId)
          .populate("client", "username email")
          .populate("applications.freelancer", "username email profilePicture")
          .populate("category", "name");
        res.status(200).json({message: "Statut de l'application mis à jour avec succès" , post: populatedPost});

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

export const searchPosts = async (req, res) => {
    try {
        const { title, category: categoryInput } = req.body;

        if (!title && !categoryInput) {
            return res.status(400).json({ message: "Veuillez fournir un titre ou une catégorie pour la recherche" });
        }

        let filter = { status: "open" };

        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        if (categoryInput) {
            // Chercher la catégorie par nom
            const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryInput.trim()}$`, 'i') } });
            if (!category) {
                return res.status(400).json({ message: "La catégorie spécifiée n'existe pas" });
            }

            // Chercher les posts dont la catégorie correspond
            filter.category = category._id;
        }

        const posts = await Post.find(filter)
            .populate("client", "username email")
            .populate("applications.freelancer", "username email")
            .populate("category", "name");

        if (posts.length === 0) {
            return res.status(404).json({ message: "Aucune offre trouvée correspondant aux critères" });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error("Erreur dans searchPosts :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const submitFinalization = async (req, res) => {
    try {
        const postId = req.params.id;
        const freelancerId = req.user.id;
        const { description } = req.body;
        const files = req.files ? req.files.map(file => file.path) : [];

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }

        // Vérifier si le freelancer est accepté pour ce projet
        const acceptedApplication = post.applications.find(
            app => app.freelancer.toString() === freelancerId && app.status === 'accepted'
        );

        if (!acceptedApplication) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à finaliser ce projet" });
        }

        // Mettre à jour le statut de finalisation
        post.finalization = {
            files,
            description,
            submittedAt: new Date(),
            status: 'submitted'
        };

        await post.save();

        // Créer une notification pour le client
        const notification = new Notification({
            recipient: post.client,
            sender: freelancerId,
            post: postId,
            type: "project_submitted",
            message: `Le projet "${post.title}" a été soumis pour finalisation`,
        });

        await notification.save();
        await User.findByIdAndUpdate(post.client, {
            $push: { notifications: notification._id },
        });

        res.status(200).json({ message: "Projet soumis avec succès", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const acceptFinalization = async (req, res) => {
    try {
        const postId = req.params.id;
        const clientId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }

        // Vérifier si l'utilisateur est le client
        if (post.client.toString() !== clientId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à accepter cette finalisation" });
        }

        // Vérifier si le projet a été soumis
        if (post.finalization.status !== 'submitted') {
            return res.status(400).json({ message: "Le projet n'a pas encore été soumis" });
        }

        // Mettre à jour le statut
        post.finalization.status = 'completed';
        post.finalization.acceptedAt = new Date();
        post.status = 'completed';

        await post.save();

        // Créer une notification pour le freelancer
        const acceptedApplication = post.applications.find(app => app.status === 'accepted');
        if (acceptedApplication) {
            const notification = new Notification({
                recipient: acceptedApplication.freelancer,
                sender: clientId,
                post: postId,
                type: "project_completed",
                message: `Votre projet "${post.title}" a été marqué comme terminé`,
            });

            await notification.save();
            await User.findByIdAndUpdate(acceptedApplication.freelancer, {
                $push: { notifications: notification._id },
            });
        }

        res.status(200).json({ message: "Projet marqué comme terminé", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const getAcceptedPostsForFreelancer = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    // Chercher tous les posts où une application a ce freelancer et status 'accepted'
    const posts = await Post.find({
      'applications': {
        $elemMatch: {
          freelancer: freelancerId,
          status: 'accepted'
        }
      }
    })
      .populate('client', 'username email')
      .populate('category', 'name');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};