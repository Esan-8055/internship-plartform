"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";

let socket: Socket | null = null;

export const useSocket = (role?: string, userId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) {
      socket = io();
    }

    function onConnect() {
      setIsConnected(true);
      if (role) {
        socket?.emit("join", role.toUpperCase());
      }
      if (userId) {
        socket?.emit("join", userId);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNotification(data: { title: string; message: string }) {
      toast({
        title: data.title,
        description: data.message,
      });
      
      // Dispatch a custom event to tell the bell to refresh
      window.dispatchEvent(new CustomEvent("refresh-notifications"));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", onNotification);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("notification", onNotification);
    };
  }, [role, userId, toast]);

  const emit = (event: string, data: any) => {
    socket?.emit(event, data);
  };

  return { isConnected, emit };
};
