/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "@/api/api";
import { CreatePostData, PostData } from "@/types";
import { toast } from "react-hot-toast";

export const useEditPost = (postId: string) => {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<CreatePostData>>({
    title: "",
    description: "",
    budget: 0,
    duration: "7j",
    skillsRequired: [], // Initialize as an empty array
    category: undefined,
    picture: undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(postId);
        setPost(postData);
        setFormData({
          title: postData.title,
          description: postData.description,
          budget: postData.budget,
          duration: postData.duration,
          skillsRequired: postData.skillsRequired || [], // Make sure it's an array
          category: postData.category?._id || undefined,
          picture: undefined,
        });
      } catch (error) {
        toast.error("Erreur lors du chargement de l’offre");
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, picture: e.target.files![0] }));
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim()) // Split the input into an array of skills
      .filter((skill) => skill.length > 0); // Remove empty skills
    setFormData((prev) => ({ ...prev, skillsRequired: skillsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    try {
      setLoading(true);
      const updatedData: Partial<CreatePostData> = {
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        duration: formData.duration,
        skillsRequired: formData.skillsRequired, // This is now an array
        category: formData.category,
        picture: formData.picture,
      };

      const response = await updatePost(postId, updatedData);
      toast.success(response.message);
      navigate("/all-posts");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l’offre");
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, formData, setFormData, handleInputChange, handleImageChange, handleSkillChange, handleSubmit };
};
