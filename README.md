# codeEngineer

<p align="center">
  <img src="public/images/readme-hero.png" width="800" alt="codeEngineer Hero Image">
</p>

<p align="center">
  <strong>「コードを研げ。知性を超えろ。」</strong><br>
  AIが生成する「実務直結型」コーディング問題プラットフォーム
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Google_Gemini-3_Pro-blue?style=for-the-badge&logo=google-gemini" alt="Gemini">
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase">
</p>

---

## 📖 Overview

**codeEngineer** は、Google の最新 AI エンジン（Gemini 2.0 / 2.5 / 3）を活用し、あなたの技術スタックに最適化されたコーディング問題を自動生成する次世代学習プラットフォームです。

単なるアルゴリズムの練習ではなく、**「設計の歪み」「パフォーマンスの壁」「セキュリティの脆弱性」**といった、現場のエンジニアが直面するリアリティのある課題を再現します。

## ✨ Key Features

- **🚀 次世代 AI エンジン搭載**: Gemini 3 Pro / Flash などの最新モデルを使用。高度な推論に基づいた質の高い問題を提供します。
- **💼 実務特化型プロンプト**: 使用技術（Next.js, Go, Rust 等）や、難易度（Tutorial 〜 Demon）を自由に組み合わせて生成可能。
- **📚 成長を記録するギャラリー**: 生成された問題は Firestore に永続化。シンタックスハイライト付きのビューアで、いつでも復習・挑戦が可能。
- **🛡️ エンタープライズ級の安全性**: Iron Session によるセキュアな API キー管理。ブラウザ側にキーが露出することはありません。
- **🎨 プレミアム UI/UX**: ガラスモーフィズムを採用したモダンなインターフェースと、レスポンシブな操作感。

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Hooks & Server Actions

### Backend & AI
- **AI Service**: [Google Generative AI (Gemini API)](https://deepmind.google/technologies/gemini/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: Iron Session (Secure Cookie-based)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- Google AI Studio (Gemini) API Key

### 2. Installation
```bash
git clone https://github.com/2525aina/codeEngineer.git
cd codeEngineer
npm install
```

### 3. Local Development (Demo Mode)
Firebase の設定なしで、即座に動作を確認できます。

```bash
# ターミナル1: Firebase エミュレーターの起動（モックDB）
npx firebase emulators:start --only firestore --project demo-problem-generator --import=./firebase-data --export-on-exit

# ターミナル2: アプリケーションの起動
npm run dev
```

ブラウザで `http://localhost:3000` を開き、**Settings** から API キーを入力してください。

## 🛡️ Deployment

本番環境（Vercel や Firebase App Hosting）へのデプロイ方法は、詳細な [Deployment Guide](./docs/DEPLOYMENT.md) （準備中）を参照してください。

## 💎 Philosophy

- **Zero Exposure**: あなたの API キーは厳重に保護されます。
- **Focus on Reality**: 教科書的な正解ではなく、現場の「最適解」を導き出す力を養います。
- **Clean Architecture**: 拡張性と保守性を両立した、モダンなディレクトリ構造。

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Developed by <strong>2525aina</strong>
</p>
