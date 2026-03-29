"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Post } from "@/lib/types";
import { getPosts } from "@/lib/api";

const ExploreMapClient = dynamic(() => import("@/components/ExploreMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data.filter((p) => p.location));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <ExploreMapClient posts={posts} />;
}
