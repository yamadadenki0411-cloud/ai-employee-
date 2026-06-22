import { ChatMessage } from "@/types";

export function ChatBubble({
  message,
  avatarEmoji,
}: {
  message: ChatMessage;
  avatarEmoji: string;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base">
        {isUser ? "🧑" : avatarEmoji}
      </div>
      <div
        className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-brand-600 text-white"
            : "rounded-tl-sm bg-white text-slate-800 shadow-sm border border-slate-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
