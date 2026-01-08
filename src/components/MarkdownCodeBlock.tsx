"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownCodeBlockProps {
    children: string;
    className?: string;
}

export default function MarkdownCodeBlock({ children, className }: MarkdownCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    // 言語を取得（className は "language-java" のような形式）
    const language = className?.replace("language-", "") || "text";
    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-muted shadow-sm my-6 bg-[#1e1e1e]">
            {/* ヘッダー部分 */}
            <div className="bg-gray-800/50 px-4 py-2 text-[10px] font-mono text-gray-400 flex justify-between items-center border-b border-white/5">
                <span className="uppercase tracking-wider font-bold">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors py-0.5"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* シンタックスハイライト付きのコード部分 */}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.85rem",
                    lineHeight: "1.6",
                    backgroundColor: "transparent",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
