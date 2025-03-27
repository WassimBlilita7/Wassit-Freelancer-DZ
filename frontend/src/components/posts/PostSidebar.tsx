// src/components/post/PostSidebar.tsx
import { PostData } from "../../types";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

const AvatarSVG = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="var(--muted)" />
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="var(--text)" />
  </svg>
);

interface PostSidebarProps {
  post: PostData;
}

export const PostSidebar = ({ post }: PostSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="lg:w-80 flex-shrink-0"
    >
      <Card style={{ backgroundColor: "var(--card)", borderColor: "var(--muted)" }} className="shadow-lg sticky top-20 border">
        <CardHeader>
          <CardTitle
            className="text-xl font-semibold flex items-center gap-2"
            style={{ color: "var(--header-text)" }}
          >
            <FaUser style={{ color: "var(--primary)" }} /> Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <AvatarSVG />
            <div>
              <p className="font-medium" style={{ color: "var(--text)" }}>{post.client?.username || "Anonyme"}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{post.client?.email || "Email non disponible"}</p>
            </div>
          </div>
          <Badge className={statusVariants({ status: post.status })}>{post.status}</Badge>
          <Button
            className="w-full text-white"
            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
          >
            Postuler maintenant
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};