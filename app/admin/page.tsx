"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStats } from "@/lib/api";
import { AdminStats } from "@/lib/types";
import { Users, FileText, MessageSquare, Flag, TrendingUp } from "lucide-react";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import { Category } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Comments",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Active Reports",
      value: stats.totalReports,
      icon: Flag,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const categories = Object.entries(stats.postsByCategory).filter(
    ([, count]) => count > 0
  ) as [Category, number][];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your RajkotLive platform
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map(([cat, count]) => {
                const max = Math.max(
                  ...categories.map(([, c]) => c)
                );
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <Badge
                        className={categoryColors[cat]}
                        variant="outline"
                      >
                        {categoryLabels[cat]}
                      </Badge>
                      <span className="font-medium">{count} posts</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">{day.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {day.posts} posts
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {day.users} new users
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Admin Login</p>
              <p className="font-mono mt-1">admin@rajkotlive.com</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Password</p>
              <p className="font-mono mt-1">any password works (demo)</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Platform</p>
              <p className="font-mono mt-1">RajkotLive v1.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
