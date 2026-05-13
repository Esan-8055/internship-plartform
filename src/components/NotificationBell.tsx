"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time refresh events from useSocket
    const handleRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);
    
    return () => window.removeEventListener("refresh-notifications", handleRefresh);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const clearAll = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-white transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#f8fafc] animate-in zoom-in duration-300">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden border-none rounded-3xl shadow-2xl" align="end">
        <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 rounded-lg"
            >
              Clear All
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <p className="text-sm text-slate-700 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {!n.read && (
                    <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
