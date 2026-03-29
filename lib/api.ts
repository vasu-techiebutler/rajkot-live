import {
  Post,
  Comment,
  Notification,
  Category,
  CreatePostInput,
  User,
  AdminStats,
} from "./types";
import { mockPosts, mockUsers, mockNotifications } from "./mock-data";

let posts = [...mockPosts];
const notifications = [...mockNotifications];
let nextPostId = 11;
let nextCommentId = 13;

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPosts(category?: Category): Promise<Post[]> {
  await delay();
  if (category) {
    return posts.filter((p) => p.category === category);
  }
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPostById(id: string): Promise<Post | null> {
  await delay();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views += 1;
  }
  return post || null;
}

export async function searchPosts(query: string): Promise<Post[]> {
  await delay();
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.location?.name.toLowerCase().includes(q) ||
      p.location?.address.toLowerCase().includes(q)
  );
}

export async function getTrending(): Promise<Post[]> {
  await delay(200);
  return [...posts]
    .sort((a, b) => b.likes + b.views - (a.likes + a.views))
    .slice(0, 5);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  await delay(500);
  const currentUser = getCurrentUser();
  const newPost: Post = {
    id: `p${nextPostId++}`,
    title: input.title,
    content: input.content,
    category: input.category,
    image:
      input.image ||
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    author: currentUser || mockUsers[0],
    location: input.location,
    likes: 0,
    views: 0,
    likedByCurrentUser: false,
    comments: [],
    createdAt: new Date().toISOString(),
    reported: false,
    reportCount: 0,
    reportedBy: [],
  };
  posts = [newPost, ...posts];
  return newPost;
}

export async function toggleLike(postId: string): Promise<Post | null> {
  await delay(200);
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  if (post.likedByCurrentUser) {
    post.likes -= 1;
    post.likedByCurrentUser = false;
  } else {
    post.likes += 1;
    post.likedByCurrentUser = true;
  }
  return { ...post };
}

export async function addComment(
  postId: string,
  content: string
): Promise<Comment | null> {
  await delay(400);
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const currentUser = getCurrentUser();
  const comment: Comment = {
    id: `c${nextCommentId++}`,
    postId,
    author: currentUser || mockUsers[0],
    content,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  return comment;
}

export async function reportPost(postId: string): Promise<boolean> {
  await delay(300);
  const post = posts.find((p) => p.id === postId);
  if (!post) return false;
  post.reported = true;
  post.reportCount += 1;
  const currentUser = getCurrentUser();
  if (currentUser && !post.reportedBy.includes(currentUser.id)) {
    post.reportedBy.push(currentUser.id);
  }
  return true;
}

export async function getNotifications(): Promise<Notification[]> {
  await delay(200);
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay(100);
  const n = notifications.find((n) => n.id === id);
  if (n) n.read = true;
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(100);
  notifications.forEach((n) => (n.read = true));
}

export async function getPostsByUser(username: string): Promise<Post[]> {
  await delay();
  return posts.filter((p) => p.author.username === username);
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  await delay();
  return mockUsers.find((u) => u.username === username) || null;
}

// Auth (mock)
const AUTH_KEY = "rajkotlive_user";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<User | null> {
  void password;
  await delay(500);
  const user = mockUsers.find((u) => u.email === email);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  // For demo, any email works — create a temp user
  const tempUser: User = {
    id: `u${Date.now()}`,
    name: email.split("@")[0],
    username: email.split("@")[0],
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    bio: "New to RajkotLive!",
    role: "user",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(tempUser));
  return tempUser;
}

export async function register(
  name: string,
  username: string,
  email: string,
  password: string
): Promise<User> {
  void password;
  await delay(500);
  const newUser: User = {
    id: `u${Date.now()}`,
    name,
    username,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    bio: "New to RajkotLive!",
    role: "user",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  return newUser;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

// ────────────────── Admin API ──────────────────

const users = [...mockUsers];

export async function getAllUsers(): Promise<User[]> {
  await delay();
  return [...users].filter((u) => !u.banned);
}

export async function getAllUsersIncludingBanned(): Promise<User[]> {
  await delay();
  return [...users];
}

export async function adminDeletePost(postId: string): Promise<boolean> {
  await delay(300);
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  return true;
}

export async function adminDeleteUser(userId: string): Promise<boolean> {
  await delay(300);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users.splice(idx, 1);
  // Also remove their posts
  posts = posts.filter((p) => p.author.id !== userId);
  return true;
}

export async function adminBanUser(userId: string): Promise<boolean> {
  await delay(300);
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.banned = true;
  return true;
}

export async function adminUnbanUser(userId: string): Promise<boolean> {
  await delay(300);
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.banned = false;
  return true;
}

export async function getReportedPosts(): Promise<Post[]> {
  await delay();
  return posts.filter((p) => p.reported && p.reportCount > 0);
}

export async function adminDismissReport(postId: string): Promise<boolean> {
  await delay(200);
  const post = posts.find((p) => p.id === postId);
  if (!post) return false;
  post.reported = false;
  post.reportCount = 0;
  post.reportedBy = [];
  return true;
}

export async function getAdminStats(): Promise<AdminStats> {
  await delay(200);
  const totalUsers = users.filter((u) => u.role !== "admin").length;
  const totalPosts = posts.length;
  const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
  const totalReports = posts.filter((p) => p.reported).length;

  const postsByCategory = {
    events: posts.filter((p) => p.category === "events").length,
    food: posts.filter((p) => p.category === "food").length,
    sports: posts.filter((p) => p.category === "sports").length,
    dayro: posts.filter((p) => p.category === "dayro").length,
    general: posts.filter((p) => p.category === "general").length,
  };

  const recentActivity = [
    { date: "Oct 5", posts: 3, users: 1 },
    { date: "Oct 6", posts: 1, users: 0 },
    { date: "Oct 7", posts: 2, users: 1 },
    { date: "Oct 8", posts: 1, users: 0 },
    { date: "Oct 9", posts: 1, users: 0 },
    { date: "Oct 10", posts: 1, users: 1 },
    { date: "Oct 11", posts: 2, users: 0 },
  ];

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalReports,
    postsByCategory,
    recentActivity,
  };
}
