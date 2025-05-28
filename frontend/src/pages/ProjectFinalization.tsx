/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPostById, submitProjectFinalization, acceptProjectFinalization, rejectProjectFinalization } from '../api/api';
import { toast } from 'react-toastify';
import { PostData } from '../types';
import { motion } from 'framer-motion';
import { FaFileDownload, FaDownload, FaFileAlt } from 'react-icons/fa';
import Lottie from 'lottie-react';
import successAnimation from '../assets/lottie/true.json';
import { Loader } from '../components/common/Loader';

const ProjectFinalization: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useContext(AuthContext);
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostById(id!);
        setPost(data);
        // Sécurité d'accès :
        const acceptedApp = data.applications.find(app => app.status === 'accepted');
        let acceptedFreelancerId = acceptedApp?.freelancer;
        if (acceptedFreelancerId && typeof acceptedFreelancerId === 'object') {
          acceptedFreelancerId = (acceptedFreelancerId as { _id: string })._id;
        }
        const clientId = data.client?._id;
        if (
          currentUserId &&
          String(acceptedFreelancerId) !== String(currentUserId) &&
          String(clientId) !== String(currentUserId)
        ) {
          toast.error("Vous n'avez pas accès à cette page");
          navigate('/');
        }
        setIsClient(currentUserId === clientId);
      } catch (e) {
        toast.error('Erreur lors du chargement du projet');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, currentUserId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !post) return;
    if (files.length === 0 && !description) {
      toast.error('Veuillez ajouter au moins un fichier ou une description.');
      return;
    }
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('description', description);
    try {
      await submitProjectFinalization(id, formData);
      toast.success('Projet soumis avec succès');
      navigate(`/post/${id}`);
    } catch {
      toast.error('Erreur lors de la soumission du projet');
    }
  };

  const handleAccept = async () => {
    if (!id) return;
    try {
      await acceptProjectFinalization(id);
      toast.success('Projet accepté avec succès');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error accepting project:', error);
      toast.error('Erreur lors de l\'acceptation du projet');
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await rejectProjectFinalization(id);
      toast.success('Projet rejeté, le freelancer peut soumettre une nouvelle version');
      navigate('/all-posts');
    } catch (error) {
      console.error('Error rejecting project:', error);
      toast.error('Erreur lors du rejet du projet');
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erreur lors du téléchargement du fichier');
    }
  };

  if (loading) return <Loader />;
  if (!post) return <div>Projet introuvable</div>;

  // Trouver le freelancer accepté
  const acceptedApp = post.applications.find(app => app.status === 'accepted');
  let acceptedFreelancerId = acceptedApp?.freelancer;
  if (acceptedFreelancerId && typeof acceptedFreelancerId === 'object') {
    acceptedFreelancerId = (acceptedFreelancerId as { _id: string })._id;
  }
  const isFreelancer = String(currentUserId) === String(acceptedFreelancerId);
  const finalization = (post as any).finalization || { status: 'pending', files: [], description: '' };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Finalisation du projet : {post.title}
        </h1>

        {/* Freelancer peut soumettre le projet */}
        {finalization.status === 'pending' && isFreelancer && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Fichiers à livrer
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      <span>Télécharger des fichiers</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                rows={4}
                placeholder="Expliquez votre livraison..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Soumettre le projet
            </motion.button>
          </motion.form>
        )}

        {/* Client peut accepter la livraison */}
        {finalization.status === 'submitted' && isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Livraison du freelancer
              </h2>
              {finalization.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {finalization.description}
                </p>
              )}
            </div>

            {finalization.files && finalization.files.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                  Fichiers livrés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finalization.files.map((file: string, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FaFileDownload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {file.split('/').pop() || `Fichier ${idx + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadFile(file, file.split('/').pop() || `Fichier_${idx + 1}`)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          title="Télécharger le fichier"
                        >
                          <FaDownload className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <FaFileAlt className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Aucun fichier livré</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mt-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAccept}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Accepter la livraison
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Demander des modifications
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Animation de succès après acceptation */}
        {finalization.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-64 h-64 mx-auto mb-6">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Projet terminé avec succès !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Le projet a été marqué comme terminé. Merci d'avoir utilisé notre plateforme.
            </p>
            {isClient ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/post/${id}/payment`)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Payer le freelancer
              </motion.button>
            ) : isFreelancer ? null : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/post/${id}`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Retour au projet
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectFinalization;

// Exemple de navigation professionnelle (à placer dans une fiche projet ou liste)
// if (user est client OU freelancer accepté) {
//   <button onClick={() => navigate(`/post/${post._id}/finalize`)}>Finaliser ce projet</button>
// } 