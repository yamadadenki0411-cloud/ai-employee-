"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DemoMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "新規顧客への営業メールを書いて",
  "提案書の構成案を作って",
  "値引き交渉への切り返しトークが欲しい",
];

export function DemoChatWindow() {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || limitReached) return;

    setError(null);
    setInput("");

    const userMsg: DemoMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました");
        if (data.limitReached) setLimitReached(true);
        return;
      }

      setRemaining(data.remaining ?? null);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="text-2xl">💼</span>
        <div>
          <p className="font-semibold text-slate-900">営業AI 田中(体験版)</p>
          <p className="text-xs text-slate-400">
            {remaining !== null ? `本日残り${remaining}回` : "ログイン不要ですぐ試せます"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" style={{ minHeight: 320 }}>
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              下のサンプルをタップするか、自由に依頼を入力してみてください
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-500 hover:text-brand-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base">
              {m.role === "user" ? "🧑" : "💼"}
            </div>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-tr-sm bg-brand-600 text-white"
                  : "rounded-tl-sm border border-slate-100 bg-slate-50 text-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-base">
              💼
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-400">
              入力中...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {error && (
        <div className="mx-5 mb-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
          {limitReached && (
            <Link
              href="/login"
              className="ml-2 inline-block font-semibold text-brand-600 underline"
            >
              無料登録して続ける →
            </Link>
          )}
        </div>
      )}

      <div className="border-t border-slate-100 px-5 py-4">
        {limitReached ? (
          <Link
            href="/login"
            className="block w-full rounded-xl bg-brand-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
          >
            無料登録してすべてのAI社員と話す
          </Link>
        ) : (
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="営業AIに依頼してみる(Enterで送信)"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              送信
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
