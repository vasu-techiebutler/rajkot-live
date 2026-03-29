"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types";
import { getTrending } from "@/lib/api";
import { categoryLabels, categoryColors } from "@/lib/mock-data";

export default function TrendingSidebar() {
  const [trending, setTrending] = useState<Post[]>([]);

  useEffect(() => {
    getTrending().then(setTrending);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Trending in Rajkot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending.map((post, i) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex gap-3 group"
          >
            <span className="text-2xl font-bold text-muted-foreground/40 leading-none mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${categoryColors[post.category]}`}
                >
                  {categoryLabels[post.category]}
                </Badge>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Heart className="h-2.5 w-2.5" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Eye className="h-2.5 w-2.5" />
                  {post.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
