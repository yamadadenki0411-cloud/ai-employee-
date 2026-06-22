import OpenAI from "openai";

interface CallOpenAIParams {
  apiKey: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

/**
 * ユーザー自身のOpenAI APIキーでチャット補完を呼び出す。
 * MVPでは gpt-4o-mini を固定使用(コストと応答速度のバランス重視)。
 */
export async function callOpenAI({
  apiKey,
  systemPrompt,
  messages,
}: CallOpenAIParams): Promise<string> {
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return completion.choices[0]?.message?.content ?? "(応答を生成できませんでした)";
}
