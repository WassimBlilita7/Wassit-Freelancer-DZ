// src/utils/formatDate.ts
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  export const timeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    const seconds = diffInSeconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (seconds < 60) {
      return seconds === 1 ? "il y a 1 seconde" : seconds <= 10 ? "il y a quelques instants" : `il y a ${seconds} secondes`;
    }
    if (minutes < 60) {
      return minutes === 1 ? "il y a 1 minute" : `il y a ${minutes} min`;
    }
    if (hours < 24) {
      return hours === 1 ? "il y a 1 heure" : `il y a ${hours} h`;
    }
    if (days < 7) {
      return days === 1 ? "il y a 1 jour" : `il y a ${days} jours`;
    }
    if (weeks < 4) {
      return weeks === 1 ? "il y a 1 semaine" : `il y a ${weeks} semaines`;
    }
    if (months < 12) {
      return months === 1 ? "il y a 1 mois" : `il y a ${months} mois`;
    }
    return years === 1 ? "il y a 1 an" : `il y a ${years} ans`;
  };