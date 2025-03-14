// src/context/PostContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { PostData } from "../types";

interface PostContextType {
  posts: PostData[];
  addPost: (post: PostData) => void;
  setPosts: (posts: PostData[]) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const addPost = (post: PostData) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};