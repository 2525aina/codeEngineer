"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
    code: string;
    language?: string;
}

/**
 * コードから ```language ... ``` のマークダウンフェンスを検出し、
 * 言語とクリーンなコードを抽出する
 */
function parseCodeFence(code: string): { language: string; cleanCode: string } {
    // マークダウンのコードフェンスパターン: ```言語名\nコード\n```
    const fencePattern = /^```(\w+)?\s*\n?([\s\S]*?)\n?```\s*$/;
    const match = code.trim().match(fencePattern);

    if (match) {
        const detectedLanguage = match[1] || "javascript";
        const cleanCode = match[2] || "";
        return { language: detectedLanguage, cleanCode: cleanCode.trim() };
    }

    // コードフェンスがない場合はそのまま返す
    return { language: "javascript", cleanCode: code };
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
    // コードフェンスを解析
    const parsed = parseCodeFence(code);

    // 明示的に渡された language があればそれを優先、なければ解析結果を使用
    const finalLanguage = language || parsed.language;
    const finalCode = parsed.cleanCode;

    return (
        <div className="rounded-xl overflow-hidden border border-muted shadow-sm my-4">
            <div className="bg-muted px-4 py-2 text-xs font-mono text-secondary flex justify-between items-center">
                <span>{finalLanguage.toUpperCase()}</span>
                <button
                    onClick={() => navigator.clipboard.writeText(finalCode)}
                    className="hover:text-primary transition-colors"
                >
                    Copy
                </button>
            </div>
            <SyntaxHighlighter
                language={finalLanguage}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    backgroundColor: "#1e1e1e",
                }}
            >
                {finalCode}
            </SyntaxHighlighter>
        </div>
    );
}
