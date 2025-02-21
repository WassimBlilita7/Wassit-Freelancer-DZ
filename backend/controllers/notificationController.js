// controllers/notificationController.js
import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username")
      .populate("post", "title")
      .sort({ createdAt: -1 }); // Trier par date décroissante

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};