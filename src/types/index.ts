export type Difficulty = 'tutorial' | 'easy' | 'medium' | 'hard' | 'demon';
export type Category = 'Frontend' | 'Backend' | 'Fullstack';

export interface CodingProblem {
    id?: string;
    title: string;
    category: Category;
    techStack: string[];
    difficulty: Difficulty;
    problemTypes: string[];
    language: string; // ← 追加：ハイライト用の言語名
    context: string;
    problemCode: string;
    solutionCode: string;
    explanation: string;
    createdAt: string;
    options?: GenerationOptions;
}

export type GeminiModel =
    | "gemini-3-pro-preview"
    | "gemini-3-flash-preview"
    | "gemini-2.5-pro"
    | "gemini-2.5-flash"
    | "gemini-2.5-flash-lite"
    | "gemini-2.0-flash-001"
    | "gemini-2.0-thinking-exp-01-21";

export interface GenerationOptions {
    category: Category;
    frontendStack?: string[];
    backendStack?: string[];
    database?: string[];
    orm?: string[];
    api?: string[];
    auth?: string[];
    test?: string[];
    difficulty: Difficulty;
    problemTypes: string[];
    customInstructions?: string;
    model?: GeminiModel; // 追加
}
