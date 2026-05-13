"use client";

import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your TARCIN AI Coach. Ask me about resumes, interviews, learning paths, or any technical challenge you're facing.",
    }
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now().toString(), role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm currently a demo interface, but soon I'll be connected to a real LLM to answer all your career and technical questions!",
        }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Career Coach</h1>
        <p className="text-slate-500">Powered by Lovable AI · Always available, judgment-free.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                  <Sparkles size={14} />
                </div>
              )}
              <div 
                className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-sm ${
                  msg.role === "user" 
                    ? "bg-[#0284c7] text-white rounded-tr-sm" 
                    : "bg-[#f1f5f9] text-slate-800 rounded-tl-sm leading-relaxed"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-5 pr-14 py-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2.5 w-10 h-10 bg-[#0284c7] hover:bg-[#026ae6] disabled:opacity-50 disabled:hover:bg-[#0284c7] text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
