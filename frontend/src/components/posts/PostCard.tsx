// src/components/posts/PostCard.tsx
import { PostData } from "../../types";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaUser, FaTag } from "react-icons/fa";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardFooter } from "./PostCardFooter";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface PostCardProps {
  post: PostData & { categoryName?: string };
  isFreelancer: boolean;
  onDelete: () => void; 
}

export const PostCard = ({ post, isFreelancer, onDelete }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="max-w-sm w-full"
    >
      <Card
        className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ backgroundColor: "var(--card)", borderRadius: "16px" }}
      >
        <PostCardHeader post={post} />
        <CardContent className="p-4 space-y-3">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <p
                  className={`text-sm ${isExpanded ? "" : "line-clamp-2"} cursor-pointer`}
                  style={{ color: "var(--muted)" }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {post.description}
                </p>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm max-w-md"
                  side="top"
                  sideOffset={5}
                >
                  {post.description}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <div className="space-y-2">
            <motion.div className="flex items-center text-sm" style={{ color: "var(--text)" }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <FaMoneyBillWave className="mr-2 text-emerald-500 dark:text-emerald-400" />
              <span className="font-medium">Budget :</span> {post.budget} DZD
            </motion.div>
            <motion.div className="flex items-center text-sm" style={{ color: "var(--text)" }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <FaClock className="mr-2 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium">Durée :</span> {post.duration}
            </motion.div>
            <motion.div className="flex items-center text-sm" style={{ color: "var(--text)" }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <FaUser className="mr-2 text-purple-500 dark:text-purple-400" />
              <span className="font-medium">Client :</span> {post.client?.username || "Inconnu"}
            </motion.div>
            <motion.div className="flex items-center text-sm" style={{ color: "var(--text)" }} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <FaTag className="mr-2 text-coral-500 dark:text-coral-400" />
              <span className="font-medium">Catégorie :</span> {post.categoryName || "Non spécifiée"}
            </motion.div>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              <p><span className="font-medium">Compétences :</span> {post.skillsRequired.join(", ")}</p>
              <p><span className="font-medium">Candidatures :</span> {post.applications.length}</p>
            </motion.div>
          )}

          <motion.div className="flex justify-center mt-2" whileHover={{ scale: 1.1 }} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-gray-500" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500" />}
          </motion.div>
        </CardContent>

        <PostCardFooter post={post} isFreelancer={isFreelancer} onDelete={onDelete} />
      </Card>
    </motion.div>
  );
};