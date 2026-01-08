# codeEngineer - 次世代コーディング問題ジェネレーター

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini 3 Pro](https://img.shields.io/badge/Gemini-3_Pro-blue?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**「コードを研げ。知性を超えろ。」**

codeEngineerは、Googleの最新AIエンジン（Gemini 2.0 / 2.5 / 3）を活用し、あなたの技術スタックに合わせた「実務直結型」のコーディング問題を自動生成するプラットフォームです。教科書的なアルゴリズム問題ではなく、設計の歪みやパフォーマンスの壁、セキュリティの脆弱性といった「現場の修羅場」を再現します。

## ✨ 主な機能

- **マルチモデル・エンジン**: 
  - **Gemini 3 Pro / Flash (Preview)**: 次世代の圧倒的な推論能力。
  - **Gemini 2.0 Thinking**: 複雑な論理思考プロセスを背景にした高度な問題。
  - **Gemini 2.5 Pro / Flash**: 高精度かつ高速な問題生成。
- **実務特化型プロンプト**: 技術スタック（フロント/バック/DB/ORM等）や難易度（チュートリアル〜魔王級）を詳細に指定可能。
- **インテリジェント・ギャラリー**: 過去に生成された問題をFirestoreで永続化。シンタックスハイライト付きでいつでも閲覧・再挑戦が可能。
- **セキュアなマルチキー管理**: モデルごとに異なるAPIキーをCookie（Iron Session）で安全に管理。
- **最先端のTech Stack**: React 19 の並行レンダリングや Tailwind CSS 4 の高速なスタイリングをフル活用。

## 🛠️ 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19, Tailwind CSS 4
- **AI Engine**: Google Generative AI (@google/generative-ai)
- **Database**: Firebase Firestore
- **Session**: Iron Session (Secure Cookie)
- **UI Components**: Lucide React, React Markdown, React Syntax Highlighter

---

## 🚀 クイックスタート（デモモード）

Firebaseプロジェクトの作成やログインは不要です。ローカル環境だけで即座に試せます。

### 1. インストール
```bash
npm install
```

### 2. Firebase エミュレーターの起動
別のターミナルで以下を実行します（モックデータベースが起動します）：
```bash
npx firebase emulators:start --only firestore --project demo-problem-generator
```

### 3. アプリケーションの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開き、**設定（Settings）**から Gemini API キーを入力すれば準備完了です。

> [!TIP]
> **Zero Config**: デモモード（エミュレーター使用）の場合、`.env.local` の作成は不要です。自動的に開発用のデフォルト設定（エミュレーター接続・デモ用セッションキー）が適用されます。個別に本番環境へ接続したり設定をカスタマイズしたい場合のみ、`.env.local` を作成してください。

---

## 🛡️ 本番環境へのデプロイ（Step-by-Step）

Firebase プロジェクトの作成から、CLI のインストール、最終的なデプロイまでの完全な手順です。

### 1. Firebase プロジェクトの作成と基本設定
1. [Firebase Console](https://console.firebase.google.com/) にアクセスし、「プロジェクトを追加」。
2. **Web アプリを登録**:
   - プロジェクト概要画面で `</>` (Web) アイコンをクリック。
   - アプリのニックネーム（例: `codeEngineer`）を入力して「アプリを登録」。
   - **表示される `firebaseConfig` の値（apiKey, authDomain 等）をメモし、本番環境の環境変数として使用します。**
3. **Firestore Database の作成**:
   - 左メニューの「構築」>「Firestore Database」から「データベースの作成」。
   - リージョンは `asia-northeast1` (東京) 等を選択。

### 2. Firebase CLI のセットアップ
ローカル環境からデプロイ操作を行うために必要です。
```bash
npm install -g firebase-tools
firebase login
```

### 3. プロジェクトの紐付け
```bash
# プロジェクトの一覧を確認
firebase projects:list

# 使用するプロジェクト ID を指定
firebase use <YOUR_PROJECT_ID>
```

### 4. Firestore ルール・インデックスのデプロイ
セキュリティルール (`firestore.rules`) とインデックスを反映させます。これを行わないと本番環境でデータが読み書きできません。
```bash
npx firebase deploy --only firestore
```

### 5. アプリケーションのデプロイ
Next.js アプリのデプロイには **Firebase App Hosting** を推奨します。

- **なぜ Firebase Hosting (`firebase deploy`) ではないのか？**:
  - 従来の Hosting は静的サイト用ですが、本アプリは Server Actions や SSR（サーバーサイドレンダリング）を多用します。
  - App Hosting はこれらを自動的に最適化して Cloud Run 等へ展開してくれるため、Next.js の全機能を最も簡単に動かせます。

**デプロイ手順:**
1. [Firebase Console](https://console.firebase.google.com/) の「App Hosting」メニューへ。
2. 「使ってみる」から GitHub リポジトリ（ソースコード）を連携。
3. **環境変数の設定 (重要)**:
   App Hosting の設定画面の「環境変数」セクションに、**手順 1 で取得した値**を以下のキー名で追加します：

   | キー名                                     | 説明・取得先             |
   | :----------------------------------------- | :----------------------- |
   | `NEXT_PUBLIC_FIREBASE_API_KEY`             | `apiKey` の値            |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | `authDomain` の値        |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | `projectId` の値         |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | `storageBucket` の値     |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` の値 |
   | `NEXT_PUBLIC_FIREBASE_APP_ID`              | `appId` の値             |
   | `NEXT_PUBLIC_FIREBASE_EMULATOR`            | `false` (本番用)         |
   | `SESSION_PASSWORD`                         | 32文字以上の安全な文字列 |

4. 設定完了後、デプロイを開始。連携が完了すると、`git push` のたびに自動でビルドとデプロイが行われます。

---

## 💎 セキュリティ・設計思想

- **Zero Exposure**: APIキーはサーバーサイドでのみ処理され、ブラウザのJavaScriptには一切露出しません。
- **Context Awareness**: 難易度 `tutorial` では親切な解説を、`demon` ではシニアエンジニアでも唸るような実務的なレビューコメントを生成します。
- **Type Safety**: TypeScriptによる厳密な型定義により、生成AIの不安定な出力を構造化データとして安全に扱います。

## ライセンス
MIT
