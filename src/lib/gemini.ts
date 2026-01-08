import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { GenerationOptions, CodingProblem } from "@/types";

export const MODELS: { id: string; name: string; tag: string; description: string }[] = [
    { id: "gemini-3-pro-preview", name: "3 Pro (Preview)", tag: "最高峰", description: "次世代 Gemini 系の 高性能プレビュー版。高度な推論やコーディング能力を提供するモデル。" },
    { id: "gemini-3-flash-preview", name: "3 Flash (Preview)", tag: "次世代標準", description: "高速応答と十分な推論性能を両立した次世代 Flash 系モデル。" },
    { id: "gemini-2.5-pro", name: "2.5 Pro", tag: "高精度", description: "複雑な問題解決と長いコンテキスト処理に特化した高性能モデル。" },
    { id: "gemini-2.5-flash", name: "2.5 Flash", tag: "高速", description: "速度と性能のバランスを極めた、大規模処理向けモデル。" },
    { id: "gemini-2.0-flash-001", name: "2.0 Flash", tag: "安定", description: "旧世代の安定モデル（新規開発では非推奨）。" },
    { id: "gemini-2.5-flash-lite", name: "2.5 Flash Lite", tag: "軽量", description: "コストを抑えて高速応答を実現する、軽量・高スループットモデル。" },
    // { id: "gemini-2.0-thinking-exp-01-21", name: "2.0 Thinking (Preview)", tag: "思考型", description: "論理的思考プロセスを可視化する、研究者・上級者プロンプト用モデル。" },
];

const schema: Schema = {
    description: "Coding problem generation schema",
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: "Title of the problem",
        },
        context: {
            type: SchemaType.STRING,
            description: "Business background and requirements (Markdown)",
        },
        problemCode: {
            type: SchemaType.STRING,
            description: "Problematic/Incomplete code for the user to solve",
        },
        solutionCode: {
            type: SchemaType.STRING,
            description: "The correct/fixed/final code",
        },
        explanation: {
            type: SchemaType.STRING,
            description: "Detailed explanation of the solution (Markdown)",
        },
        techStack: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Actual technology stack used in this problem",
        },
    },
    required: ["title", "context", "problemCode", "solutionCode", "explanation", "techStack"],
};

export async function generateProblem(apiKey: string, options: GenerationOptions): Promise<CodingProblem> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const selectedModel = options.model || "gemini-2.0-flash";

    const model = genAI.getGenerativeModel({
        model: selectedModel,
        generationConfig: {
            responseMimeType: "application/json",
        },
    });

    const prompt = `あなたはシニアソフトウェアエンジニア兼テックリードです。
以下の仕様を厳密に守り、実務向けのコーディング問題を1問生成してください。

====================
【1. 出題カテゴリ】
${options.category}

【2. 技術スタック】
フロントエンド: ${options.frontendStack?.join(', ') || 'N/A'}
バックエンド: ${options.backendStack?.join(', ') || 'N/A'}
データベース: ${options.database?.join(', ') || 'N/A'}
ORM: ${options.orm?.join(', ') || 'N/A'}
API: ${options.api?.join(', ') || 'N/A'}
認証: ${options.auth?.join(', ') || 'N/A'}
テスト: ${options.test?.join(', ') || 'N/A'}

【3. 難易度と期待するレベル】
${options.difficulty}
- tutorial: プログラミング初学者や新卒1ヶ月目レベル。基本的な文法（if, for, 単純なメソッド呼び出し）の理解を問う。複雑なライブラリや高度な抽象化は避ける。
- easy: ジュニアエンジニアレベル。実務でよく使う標準的な機能やライブラリの使い方。
- medium: 中堅エンジニアレベル。設計の良し悪しや、パフォーマンス、セキュリティを考慮した実装。
- hard: シニアエンジニアレベル。複雑なビジネスロジック、並行処理、高度なアーキテクチャ設計。
- demon: テックリード・アーキテクトレベル。極めて稀なエッジケース、言語やフレームワークの内部構造に深く関わる問題。

【4. 問題タイプ】
${options.problemTypes.join(', ')}

【5. 追加指示（ユーザー指定）】
${options.customInstructions || 'なし'}

====================
【制約】
- 実在しないライブラリやAPIを使用しない
- フレームワークの思想に反する実装をしない
- 出力コードは実行しない前提（表示用）
- 日本語で出力する
- 難易度が tutorial の場合は、解説を極めて丁寧に、専門用語を噛み砕いて説明すること。
- 初心者向けチュートリアル問題は、tutorial難易度の場合のみ許可する。
- 難易度が高い（medium以上）場合は、実務レビューで議論が発生するレベルの内容とする。
- タイトルは30文字以内で簡潔に。
- **context(業務背景)およびexplanation(解説)は、Markdown記法を最大限活用して構造化してください。**
  - クラス名、変数名、定数、ファイルパスなどは必ず \` \` (インラインコード)で囲むこと。
  - **コードスニペットや設定ファイルの断片を含める場合は、必ず \`\`\` (トリプルバックティック) と適切な言語指定（例: \`\`\`java, \`\`\`typescript, \`\`\`yaml）を使用すること。**
  - 要件や手順、修正ポイントは **箇条書き (-)** や **番号付きリスト (1.)** を適切に使い分けて整理すること。
  - 重要な論理や用語は ** ** (強調)で目立たせること。
  - 適宜、### 見出しを使ってセクションを分けること。
- 必ず以下のJSON形式のみを出力し、他のテキストは含めないでください。
  {
    "title": "...",
    "context": "...",
    "problemCode": "...",
    "solutionCode": "...",
    "explanation": "...",
    "techStack": ["...", "..."]
  }
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);

    return {
        ...parsed,
        category: options.category,
        difficulty: options.difficulty,
        problemTypes: options.problemTypes,
        createdAt: new Date(), // This will be converted to Firestore Timestamp later
    };
}

export async function validateApiKey(apiKey: string, modelId: string = "gemini-2.0-flash-001"): Promise<boolean> {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelId });

        // countTokens で疎通確認（指定されたモデルがそのキーとAPIバージョンで利用可能かチェック）
        await model.countTokens("Connectivity check");
        return true;
    } catch (error) {
        console.error(`API Key Validation Error for ${modelId}:`, error);
        return false;
    }
}
