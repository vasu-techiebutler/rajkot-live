export type Category = "events" | "food" | "sports" | "dayro" | "general";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: UserRole;
  banned?: boolean;
  createdAt: string;
}

export interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: Category;
  image: string;
  author: User;
  location?: Location;
  likes: number;
  views: number;
  likedByCurrentUser: boolean;
  comments: Comment[];
  createdAt: string;
  reported: boolean;
  reportCount: number;
  reportedBy: string[];
  deletedAt?: string;
}

export interface Notification {
  id: string;
  type: "comment" | "like" | "report";
  message: string;
  postId: string;
  read: boolean;
  createdAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: Category;
  image?: string;
  location?: Location;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalReports: number;
  postsByCategory: Record<Category, number>;
  recentActivity: { date: string; posts: number; users: number }[];
}
