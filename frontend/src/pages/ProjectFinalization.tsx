/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPostById, submitProjectFinalization, acceptProjectFinalization } from '../api/api';
import { toast } from 'react-toastify';
import { PostData } from '../types';

const ProjectFinalization: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useContext(AuthContext);
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');

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
      toast.success('Projet marqué comme terminé');
      navigate(`/post/${id}`);
    } catch {
      toast.error('Erreur lors de la validation du projet');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!post) return <div>Projet introuvable</div>;

  // Trouver le freelancer accepté
  const acceptedApp = post.applications.find(app => app.status === 'accepted');
  let acceptedFreelancerId = acceptedApp?.freelancer;
  if (acceptedFreelancerId && typeof acceptedFreelancerId === 'object') {
    acceptedFreelancerId = (acceptedFreelancerId as { _id: string })._id;
  }
  const clientId = post.client?._id;
  const isFreelancer = String(currentUserId) === String(acceptedFreelancerId);
  const isClient = String(currentUserId) === String(clientId);
  const finalization = (post as any).finalization || { status: 'pending', files: [], description: '' };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Finalisation du projet : {post.title}</h1>

      {/* Freelancer peut soumettre le projet */}
      {finalization.status === 'pending' && isFreelancer && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Fichiers à livrer</label>
            <input type="file" multiple onChange={handleFileChange} className="block" />
          </div>
          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Expliquez votre livraison..."
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Soumettre</button>
        </form>
      )}

      {/* Client peut accepter la livraison */}
      {finalization.status === 'submitted' && isClient && (
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">Livraison du freelancer</h2>
            <ul className="list-disc ml-6">
              {finalization.files && finalization.files.length > 0 ? (
                finalization.files.map((file: string, idx: number) => (
                  <li key={idx}><a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Fichier {idx + 1}</a></li>
                ))
              ) : (
                <li>Aucun fichier livré</li>
              )}
            </ul>
            {/* Affichage des URLs envoyées par le freelancer */}
            {finalization.urls && Array.isArray(finalization.urls) && finalization.urls.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-1">Liens envoyés :</h3>
                <ul className="list-disc ml-6">
                  {finalization.urls.map((url: string, idx: number) => (
                    <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lien {idx + 1}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4"><strong>Description :</strong> {finalization.description || 'Aucune'}</p>
          </div>
          <button onClick={handleAccept} className="bg-green-600 text-white px-6 py-2 rounded">Accepter et marquer comme terminé</button>
        </div>
      )}

      {/* Affichage pour tous */}
      {finalization.status === 'completed' && (
        <div className="mt-8 p-4 bg-green-100 rounded">
          <h2 className="font-semibold text-lg mb-2">Projet terminé !</h2>
          <ul className="list-disc ml-6">
            {finalization.files && finalization.files.length > 0 ? (
              finalization.files.map((file: string, idx: number) => (
                <li key={idx}><a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Fichier {idx + 1}</a></li>
              ))
            ) : (
              <li>Aucun fichier livré</li>
            )}
          </ul>
          {/* Affichage des URLs envoyées par le freelancer */}
          {finalization.urls && Array.isArray(finalization.urls) && finalization.urls.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">Liens envoyés :</h3>
              <ul className="list-disc ml-6">
                {finalization.urls.map((url: string, idx: number) => (
                  <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lien {idx + 1}</a></li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4"><strong>Description :</strong> {finalization.description || 'Aucune'}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectFinalization;

// Exemple de navigation professionnelle (à placer dans une fiche projet ou liste)
// if (user est client OU freelancer accepté) {
//   <button onClick={() => navigate(`/post/${post._id}/finalize`)}>Finaliser ce projet</button>
// } 