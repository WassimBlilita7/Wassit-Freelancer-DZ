/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead } from "@/api/api";

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

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response);
      setUnreadCount(response.filter((notif: Notification) => !notif.isRead).length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Actualisation toutes les 30 secondes
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  const markAllAsRead = async (_unreadIds: string[]) => {
    try {
      const unreadIds = notifications
        .filter((notif) => !notif.isRead)
        .map((notif) => notif._id);
      if (unreadIds.length > 0) {
        await markAllAsRead(unreadIds); // Passer les IDs à l'API
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
    }
  };

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead };
};