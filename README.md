# AI社員 MVP

営業AI・マーケAI・開発AIを雇い、チャット形式で仕事を依頼できるWebサービス。

## 技術構成

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Supabase (Auth + DB)
- OpenAI API (gpt-4o-mini)

## セットアップ手順

### 1. 依存関係インストール

```bash
npm install
```

### 2. Supabaseプロジェクト作成

1. https://supabase.com でプロジェクトを作成
2. SQL Editorで `supabase/schema.sql` の内容を実行
3. Project Settings → API から URL と anon key を取得

### 3. 環境変数設定

`.env.local.example` を `.env.local` にコピーし、Supabaseの値を入力。

```bash
cp .env.local.example .env.local
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で起動します。

## 利用の流れ

### 通常利用
1. `/login` でメールアドレス・パスワードで新規登録(確認メールが届きます)
2. `/settings` でOpenAI APIキーを登録(https://platform.openai.com/api-keys で発行)
3. `/dashboard` で「採用する」からAI社員(10種類から選択)を雇用
4. AI社員カードをクリックしてチャット開始

### ログイン不要デモ
1. トップページまたは `/demo` にアクセス
2. 営業AIに自由にメッセージを送信(固定応答、API費用ゼロ)
3. 1日5回まで(IPアドレス単位、`demo_usage`テーブルで記録)
4. 上限到達後は登録導線を表示

## 既知の制約(MVPスコープ外)

このMVPには以下が含まれていません。本番運用前に対応が必要です。

| 項目 | 状態 | 備考 |
|---|---|---|
| APIキーの暗号化 | 未対応 | 現在DBに平文保存。`pgsodium`等での暗号化を推奨 |
| 課金・サブスク | 保留中 | Stripe連携は次フェーズ |
| 利用量制限(本番チャット) | 未対応 | ユーザーが自分のキーを使うため運営側コストはないが、誤爆防止のレート制限は推奨 |
| ストリーミング応答 | 未対応 | 現状は応答完了後に一括表示。体感速度向上には要実装 |
| AI社員のカスタムプロンプト編集 | 未対応 | 現状はテンプレ固定。差別化要因として優先度高 |
| パスワードリセット | 未対応 | Supabase Auth標準機能で追加可能 |
| デモのIP制限の限界 | 既知の弱点 | x-forwarded-forは偽装可能。本格的な不正対策にはCloudflare等のBot対策が必要 |
| 7種類のAI社員プロンプト | 簡易版 | hr/finance/legal/designer/writer/cs/secretaryは最低限の品質。利用状況を見て個別に磨き込み推奨 |

## 次の開発優先順位(提案)

1位(登録率最大化の次の一手): デモ体験後の離脱率を計測し、CTA文言・配置のABテスト
2位(最短収益化、保留中): Stripeサブスク課金 + 運営管理APIキー(従量課金込みプラン)
3位(自動化しやすい): AI社員によるタスクの自動実行(メール送信、SNS投稿等の外部API連携)
