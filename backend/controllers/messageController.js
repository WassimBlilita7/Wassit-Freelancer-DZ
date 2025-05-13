import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {

    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId)
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Destinataire non trouvé" });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });

        await newMessage.save();

        res.status(201).json({ message: "Message envoyé avec succès" });


        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }

};

export const getConversation = async (req, res)=>{
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const message = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 })
        .populate("sender" , "username")
        .populate("receiver" , "username")

        res.status(200).json(message);
    } catch (error) {
         
        res.status(500).json({message : "Erreur Serveur"});
    }
};

export const markAsRead = async (req, res)=>{

    try {
        const {messageId} = req.params;

        const message = await Message.findByIdAndUpdate(
            messageId,
            {read : true},
            {new : true}
        );

        if(!message){
            return res.status(404).json({message: "Message non Trouvé"});
        }

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur Serveur" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        

        const message = await Message.findOne({
            _id : messageId,
            sender : userId
        });

        if(!message){
            return res.status(404).json({ message: "Message non trouvé ou non autorisé" });
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Message supprimé avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur Serveur" });
    }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const interlocutors = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== userId) interlocutors.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId) interlocutors.add(msg.receiver.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(interlocutors) } }).select('username profile.profilePicture');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};