"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, FileText, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/PostCard";
import { User, Post } from "@/lib/types";
import { getUserByUsername, getPostsByUser } from "@/lib/api";
import { format } from "date-fns";

export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = params.username as string;
    Promise.all([getUserByUsername(username), getPostsByUser(username)]).then(
      ([u, p]) => {
        setUser(u);
        setPosts(p);
        setLoading(false);
      }
    );
  }, [params.username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground">This user doesn&apos;t exist.</p>
      </div>
    );
  }

  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm mt-2">{user.bio}</p>
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Joined {format(new Date(user.createdAt), "MMM yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {posts.length} posts
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {totalLikes} likes
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <h2 className="text-lg font-semibold mb-4">
        Posts by {user.name} ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No posts yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
