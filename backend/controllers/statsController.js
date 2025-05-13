import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getClientStats = async (req, res) => {
    try {
        const clientId = req.user.id;

        // Vérifier si l'utilisateur est un client
        const client = await User.findById(clientId);
        if (!client || client.isFreelancer) {
            return res.status(403).json({ message: "Accès non autorisé" });
        }

        // Récupérer toutes les offres du client
        const posts = await Post.find({ client: clientId });

        // Calculer les statistiques
        const totalOffers = posts.length;
        const activeOffers = posts.filter(post => post.status === "open").length;
        const completedOffers = posts.filter(post => post.status === "completed").length;
        
        // Calculer le budget total
        const totalBudget = posts.reduce((sum, post) => sum + post.budget, 0);
        
        // Calculer le nombre total de freelancers engagés (toutes les candidatures uniques)
        const uniqueFreelancers = new Set();
        posts.forEach(post => {
            post.applications.forEach(application => {
                uniqueFreelancers.add(application.freelancer.toString());
            });
        });

        // Calculer le nombre de freelancers actifs (ceux qui ont des candidatures en cours)
        const activeFreelancers = new Set();
        posts.forEach(post => {
            post.applications.forEach(application => {
                if (application.status === "accepted") {
                    activeFreelancers.add(application.freelancer.toString());
                }
            });
        });

        res.status(200).json({
            stats: {
                totalOffers,
                activeOffers,
                completedOffers,
                totalBudget,
                totalFreelancers: uniqueFreelancers.size,
                activeFreelancers: activeFreelancers.size
            }
        });
    } catch (error) {
        console.error("Erreur dans getClientStats:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const getClientStatsByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const client = await User.findOne({ username: username.toLowerCase() });
        if (!client || client.isFreelancer) {
            return res.status(404).json({ message: "Client non trouvé" });
        }
        const clientId = client._id;
        const posts = await Post.find({ client: clientId });
        const totalOffers = posts.length;
        const activeOffers = posts.filter(post => post.status === "open").length;
        const completedOffers = posts.filter(post => post.status === "completed").length;
        const totalBudget = posts.reduce((sum, post) => sum + post.budget, 0);
        const uniqueFreelancers = new Set();
        posts.forEach(post => {
            post.applications.forEach(application => {
                uniqueFreelancers.add(application.freelancer.toString());
            });
        });
        const activeFreelancers = new Set();
        posts.forEach(post => {
            post.applications.forEach(application => {
                if (application.status === "accepted") {
                    activeFreelancers.add(application.freelancer.toString());
                }
            });
        });
        res.status(200).json({
            stats: {
                totalOffers,
                activeOffers,
                completedOffers,
                totalBudget,
                totalFreelancers: uniqueFreelancers.size,
                activeFreelancers: activeFreelancers.size
            }
        });
    } catch (error) {
        console.error("Erreur dans getClientStatsByUsername:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}; 