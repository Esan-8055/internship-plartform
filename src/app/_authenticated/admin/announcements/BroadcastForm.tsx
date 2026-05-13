"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSocket } from "@/hooks/use-socket";

export function BroadcastForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { emit } = useSocket("ADMIN");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !title.trim()) return;

    setIsSending(true);

    try {
      // 1. Emit real-time notification
      emit("send-notification", {
        target: "ALL",
        title: title,
        message: message
      });

      // 2. Save to database via API
      await fetch("/api/admin/broadcast", {
        method: "POST",
        body: JSON.stringify({ message: `${title}: ${message}`, targetRole: "ALL" }),
        headers: { "Content-Type": "application/json" }
      });

      setTitle("");
      setMessage("");
      alert("Announcement sent successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Compose</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Title</label>
          <input 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
            placeholder="Announcement title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Message</label>
          <textarea 
            required 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 text-sm min-h-[180px] focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none" 
            placeholder="Write your message..."
          />
        </div>
        <Button type="submit" disabled={isSending} className="w-full h-12 bg-[#026ae6] hover:bg-[#0256b9] rounded-xl font-bold text-white shadow-md shadow-blue-100">
          {isSending ? "Sending..." : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send to all
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
