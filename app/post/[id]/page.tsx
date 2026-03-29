"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Eye,
  Share2,
  Flag,
  Loader2,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LocationCard from "@/components/LocationCard";
import { Post, Comment } from "@/lib/types";
import { getPostById, toggleLike, addComment, reportPost } from "@/lib/api";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export default function PostPage() {
  const params = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (params.id) {
      getPostById(params.id as string).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  const handleLike = async () => {
    if (!post || !user) return;
    const updated = await toggleLike(post.id);
    if (updated) setPost(updated);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !user || !commentText.trim()) return;
    setSubmitting(true);
    const comment = await addComment(post.id, commentText.trim());
    if (comment) {
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment] } : prev
      );
      setCommentText("");
    }
    setSubmitting(false);
  };

  const handleReport = async () => {
    if (!post) return;
    await reportPost(post.id);
    setReported(true);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <p className="text-muted-foreground mb-4">
          This post may have been removed.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to feed
      </Link>

      <article>
        {post.image && (
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        <Badge
          variant="outline"
          className={`mb-3 ${categoryColors[post.category]}`}
        >
          {categoryLabels[post.category]}
        </Badge>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="font-medium hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none mb-6">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-3 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={post.likedByCurrentUser ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={!user}
          >
            <Heart
              className={`h-4 w-4 mr-1.5 ${
                post.likedByCurrentUser ? "fill-current" : ""
              }`}
            />
            {post.likes}
          </Button>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {post.comments.length}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {post.views}
          </span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  disabled={reported}
                >
                  <Flag className="h-4 w-4 mr-1.5" />
                  {reported ? "Reported" : "Report"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report this post?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  This post will be flagged for admin review. Are you sure?
                </p>
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReport}
                  >
                    Report Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Location */}
        {post.location && (
          <div className="mb-6">
            <LocationCard location={post.location} />
          </div>
        )}

        <Separator className="my-6" />

        {/* Comments */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Comments ({post.comments.length})
          </h3>

          {user && (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="resize-none mb-2"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentText.trim() || submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
                    Comment
                  </Button>
                </div>
              </div>
            </form>
          )}

          {!user && (
            <Card className="mb-6">
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Sign in to leave a comment
                </p>
                <Button size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {post.comments.map((comment: Comment) => (
              <div key={comment.id} className="flex gap-3">
                <Link href={`/profile/${comment.author.username}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {comment.author.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
