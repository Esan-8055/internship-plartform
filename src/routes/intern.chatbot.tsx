import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/tarcin/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/intern/chatbot")({ component: Chatbot });

type Msg = { role: "user" | "assistant"; text: string };

function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi Aarav! I'm your TARCIN AI Coach. Ask me about resumes, interviews, learning paths, or any technical challenge you're facing." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", text: input }, { role: "assistant", text: "Great question! Here's a curated answer (demo mode — connect Lovable AI Gateway to enable streaming responses)." }]);
    setInput("");
  };

  return (
    <>
      <PageHeader title="AI Career Coach" description="Powered by Lovable AI · Always available, judgment-free." />
      <Card className="flex flex-col h-[calc(100vh-260px)] min-h-[400px] shadow-card">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center mr-3 shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4 flex gap-2">
          <Input placeholder="Ask anything…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="h-11" />
          <Button onClick={send} className="h-11 bg-gradient-primary"><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </>
  );
}
