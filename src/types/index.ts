export type RoleType =
  | "sales"      // 営業AI
  | "marketing"  // マーケAI
  | "engineer"   // 開発AI
  | "cs"         // カスタマーサポートAI
  | "hr"         // 人事AI
  | "finance"    // 経理AI
  | "legal"      // 法務AI
  | "designer"   // デザインAI
  | "writer"     // ライターAI
  | "secretary"; // 秘書AI

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  plan: "free" | "pro" | "business";
  openai_api_key: string | null;
  created_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  role_type: RoleType;
  name: string;
  system_prompt: string;
  avatar_emoji: string;
  status: "active" | "paused";
  created_at: string;
}

export interface ChatMessage {
  id: string;
  employee_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface EmployeeTemplate {
  role_type: RoleType;
  name: string;
  avatar_emoji: string;
  description: string;
  system_prompt: string;
}
