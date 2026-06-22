"use client";

import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatMessage, Employee } from "@/types";

export function ChatWindow({
  employee,
  initialMessages,
}: {
  employee: Employee;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");

    // 楽観的UI更新(ユーザーメッセージは即時表示)
    const optimisticUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      employee_id: employee.id,
      user_id: "temp",
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employee.id, message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました");
        return;
      }

      setMessages((prev) => [...prev, data.reply as ChatMessage]);
    } catch {
      setError("通信エラーが発生しました。ネットワークをご確認ください。");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            {employee.name}に最初のメッセージを送ってみましょう
          </div>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} avatarEmoji={employee.avatar_emoji} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-base">
              {employee.avatar_emoji}
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-2.5 text-sm text-slate-400 shadow-sm">
              入力中...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {error && (
        <div className="mx-6 mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${employee.name}に依頼する内容を入力(Enterで送信、Shift+Enterで改行)`}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
