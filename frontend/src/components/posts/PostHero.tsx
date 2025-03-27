// src/components/post/PostHero.tsx
import { PostData } from "../../types";
import { FaTags } from "react-icons/fa";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { cva } from "class-variance-authority";

const statusVariants = cva(
  "px-4 py-1 rounded-full text-sm font-medium tracking-wide uppercase",
  {
    variants: {
      status: {
        open: "bg-[var(--success)]/20 text-[var(--success)]",
        "in-progress": "bg-[var(--accent)]/20 text-[var(--accent)]",
        completed: "bg-[var(--muted)]/20 text-[var(--muted)]",
      },
    },
    defaultVariants: { status: "open" },
  }
);

interface PostHeroProps {
  post: PostData;
}

export const PostHero = ({ post }: PostHeroProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl shadow-xl p-8 text-white"
      style={{ background: "linear-gradient(to right, var(--primary), var(--secondary))" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaTags style={{ color: "var(--success)" }} className="text-3xl" />
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <Badge className={statusVariants({ status: post.status })}>{post.status}</Badge>
      </div>
      <p className="mt-2 text-sm opacity-80">
        Posté le {new Date(post.createdAt).toLocaleDateString()} par {post.client?.username || "Anonyme"}
      </p>
    </motion.div>
  );
};