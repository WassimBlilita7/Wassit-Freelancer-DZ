import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Notification {
  _id: string;
  recipient: string;
  sender: { _id: string; username: string };
  post: { _id: string; title: string };
  type: "application_accepted" | "new_application";
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationIconProps {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onClick: () => void;
}

export const NotificationIcon = ({ unreadCount, notifications, markAsRead, markAllAsRead, onClick }: NotificationIconProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
    setIsOpen(!isOpen);
    onClick();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              Aucune notification
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 ${
                  notif.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                onClick={async () => {
                  if (!notif.isRead) {
                    await markAsRead(notif._id); // Marquer comme lu si cliqué individuellement
                  }
                  navigate(`/post/${notif.post._id}`);
                  setIsOpen(false);
                }}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {notif.message}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};