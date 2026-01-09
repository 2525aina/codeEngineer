"use client";

import { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownCodeBlockProps {
    children: string | string[];
    className?: string;
}

export default function MarkdownCodeBlock({ children, className }: MarkdownCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    // react-markdown から渡される className は "language-typescript:filename.ts" のような形式
    const fullLanguageInfo = className?.replace("language-", "") || "text";

    // ":" で分割して言語とファイル名を抽出
    const [language, filename] = fullLanguageInfo.split(":");

    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-2xl overflow-hidden border border-muted bg-[#1e1e1e] shadow-lg my-8 group/md transition-all hover:shadow-primary/5">
            {/* Header */}
            <div className="bg-[#252526] border-b border-white/5 flex items-center justify-between px-4 py-0">
                <div className="flex items-center gap-2 py-3 border-b-2 border-primary">
                    <FileCode className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold text-white">
                        {filename || (language === "text" ? "README.txt" : `snippet.${language}`)}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-white/10 text-secondary hover:text-white transition-all active:scale-95 flex items-center gap-2"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] uppercase font-bold tracking-widest">{copied ? "Copied" : "Copy"}</span>
                </button>
            </div>

            {/* Language Sub-header */}
            <div className="bg-[#2d2d2d] px-4 py-1.5 flex items-center gap-1.5 border-b border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{language}</span>
            </div>

            {/* Code Content */}
            <div className="relative">
                <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        fontSize: "0.85rem",
                        lineHeight: "1.6",
                        backgroundColor: "transparent",
                    }}
                    codeTagProps={{
                        className: "font-mono"
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

