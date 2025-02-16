import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

// ajouter review

export const addReview = async (req, res) => {
    try {
        const {freelancerId , postId, rating, comment} = req.body;
        const clientId = req.user.id;

        const post = await Post.findById(postId);
        if (!post ||post.client.toString() !== clientId) {
            return res.status(404).json({ message: "Vous n'êtes pas autorisé à laisser un avis pour cette offre" });
        }


        const freelancer = await User.findById(freelancerId);
        if(!freelancer || !freelancer.isFreelancer) {
            return res.status(404).json({ message: "Freelancer non trouvé" });
        }

        const existingReview = await Review.findOne({ client: clientId, freelancer: freelancerId, post: postId });

        if (existingReview) {
            return res.status(400).json({ message: "Vous avez déjà laissé un avis pour ce freelancer" });
        }

        if(!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Veuillez fournir une note entre 1 et 5" });
        }

        //Creer un nouvel avis
        const newReview = new Review({
            client: clientId,
            freelancer: freelancerId,
            post: postId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({ message: "Avis ajouté avec succès" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 

export const getFreelancerReviews = async (req, res) => {
    try {
        const freelancerId = req.params.freelancerId;

        const freelancer = await User.findById(freelancerId);
        if(!freelancer || !freelancer.isFreelancer) {
            return res.status(404).json({ message: "Freelancer non trouvé" });
        }
        const reviews = await Review.find({ freelancer: freelancerId }).populate("client", "username email").populate("post", "title");
        
        res.status(200).json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const { rating, comment } = req.body;
        const clientId = req.user.id;

        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({ message: "Avis non trouvé" });
        }

        if(review.client.toString() !== clientId){
            return res.status(401).json({ message: "Vous n'êtes pas autorisé à mettre à jour cet avis" });
        }

        if(rating && (typeof rating !== "number" || rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Veuillez fournir une note entre 1 et 5" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();

        res.status(200).json({ message: "Avis mis à jour avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const clientId = req.user.id;

        const review = await Review.findById(reviewId);


        if(!review){
            return res.status(404).json({ message: "Avis non trouvé" });
        }

        if(review.client.toString() !== clientId){
            return res.status(401).json({ message: "Vous n'êtes pas autorisé à supprimer cet avis" });
        }

        await Review.findByIdAndDelete(reviewId);
        
        res.status(200).json({ message: "Avis supprimé avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};