"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { Post, Category } from "@/lib/types";
import { getPosts } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  category?: Category;
}

export default function PostFeed({ category }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts(category).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
