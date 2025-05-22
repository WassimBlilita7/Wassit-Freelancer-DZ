import { useState } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  _id: string;
  recipient: string;
  sender: { _id: string; username: string };
  post: { _id: string; title: string };
  type: "application_accepted" | "new_application" | "application_accepted_by_client" | "project_submitted" | "project_completed";
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationIconProps {
  unreadCount?: number;
  notifications: Notification[];
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onClick?: () => void;
  isFreelancer?: boolean;
}

export const NotificationIcon = ({ 
  unreadCount = 0, 
  notifications, 
  markAsRead, 
  markAllAsRead, 
  onClick = () => {},
  isFreelancer = false 
}: NotificationIconProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    setIsOpen(!isOpen);
    onClick();
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }

    // Navigation basée sur le type de notification et le rôle de l'utilisateur
    if (isFreelancer) {
      // Navigation pour les freelancers
      switch (notif.type) {
        case "application_accepted_by_client":
          // Quand le freelancer est accepté, naviguer vers la page de finalisation pour soumettre les fichiers
          navigate(`/post/${notif.post._id}/finalize`);
          break;
        case "project_completed":
          // Quand le projet est terminé, naviguer vers la page de finalisation pour voir le statut
          navigate(`/post/${notif.post._id}/finalize`);
          break;
        default:
          navigate(`/post/${notif.post._id}`);
      }
    } else {
      // Navigation pour les clients
      switch (notif.type) {
        case "new_application":
          navigate(`/post/${notif.post._id}/applications`);
          break;
        case "project_submitted":
          navigate(`/post/${notif.post._id}/finalize`);
          break;
        default:
          navigate(`/post/${notif.post._id}`);
      }
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-20"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FaCheck className="w-3 h-3" />
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${!notif.isRead ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};