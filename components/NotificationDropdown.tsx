"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Notification } from "@/lib/types";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={handleMarkAllRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={`/post/${n.postId}`}
                onClick={() => {
                  handleMarkRead(n.id);
                  setOpen(false);
                }}
                className={`block px-4 py-3 border-b last:border-0 hover:bg-muted transition-colors ${
                  !n.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
              >
                <p className="text-sm leading-snug">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
