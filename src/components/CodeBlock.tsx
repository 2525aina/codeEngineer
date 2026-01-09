"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileCode, Copy, Check, ChevronRight } from "lucide-react";

interface CodeFile {
    language: string;
    filename: string;
    code: string;
}

interface CodeBlockProps {
    code: string;
    language?: string; // 全体的なデフォルト言語
}

/**
 * コード文字列を解析し、複数のファイル（コードブロック）を抽出する
 */
function parseMultiFiles(input: string, defaultLang: string = "javascript"): CodeFile[] {
    const trimmed = input.trim();
    const blocks: CodeFile[] = [];

    // 改良版正規表現: ```language[:filename]\n code \n```
    // 言語名の後やファイル名の前にスペースがあっても許容するように調整
    const fenceRegex = /```([\w-]+)?(?::([\w\.\/\-_ ]+))?\s*\n([\s\S]*?)\n```/g;

    let match;
    let lastIndex = 0;

    while ((match = fenceRegex.exec(trimmed)) !== null) {
        const lang = (match[1] || defaultLang).toLowerCase();
        const filename = match[2]?.trim() || `file_${blocks.length + 1}.${getFileExtension(lang)}`;
        const code = match[3].trim();

        blocks.push({ language: lang, filename, code });
        lastIndex = fenceRegex.lastIndex;
    }

    // コードブロックが1つも見つからなかった場合、全体を1つのファイルとして扱う
    if (blocks.length === 0) {
        return [{
            language: defaultLang.toLowerCase(),
            filename: `source.${getFileExtension(defaultLang)}`,
            code: trimmed
        }];
    }

    return blocks;
}

/**
 * 言語名から拡張子を推測する
 */
function getFileExtension(lang: string): string {
    const extensions: Record<string, string> = {
        typescript: "ts",
        tsx: "tsx",
        javascript: "js",
        jsx: "jsx",
        python: "py",
        java: "java",
        go: "go",
        rust: "rs",
        cpp: "cpp",
        sql: "sql",
        html: "html",
        css: "css"
    };
    return extensions[lang.toLowerCase()] || "txt";
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
    const files = parseMultiFiles(code, language || "javascript");
    const [activeTab, setActiveTab] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(files[activeTab].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (files.length === 0) return null;

    return (
        <div className="rounded-2xl overflow-hidden border border-muted bg-[#1e1e1e] shadow-xl group my-6 transition-all hover:shadow-primary/5">
            {/* Tab Bar / Header */}
            <div className="bg-[#252526] border-b border-white/5 flex flex-wrap items-center px-2 py-0">
                <div className="flex flex-1 overflow-x-auto no-scrollbar scroll-smooth">
                    {files.map((file, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold transition-all border-b-2 shrink-0 ${activeTab === idx
                                ? "bg-[#1e1e1e] text-primary border-primary"
                                : "text-secondary hover:text-white border-transparent hover:bg-white/5"
                                }`}
                        >
                            <FileCode className={`w-3.5 h-3.5 ${activeTab === idx ? "text-primary" : "text-secondary/50"}`} />
                            {file.filename}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 px-3 py-2 border-l border-white/5">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-white/10 text-secondary hover:text-white transition-all active:scale-95 flex items-center gap-2"
                        title="Copy code"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px] hidden sm:inline uppercase font-bold tracking-widest">{copied ? "Copied" : "Copy"}</span>
                    </button>
                </div>
            </div>

            {/* Language Banner (Sub-header) */}
            <div className="bg-[#2d2d2d] px-4 py-1.5 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{files[activeTab].language}</span>
                </div>
                {files.length > 1 && (
                    <div className="text-[9px] text-secondary/40 font-bold uppercase tracking-tighter">
                        File {activeTab + 1} of {files.length}
                    </div>
                )}
            </div>

            {/* Code Content */}
            <div className="relative">
                <SyntaxHighlighter
                    language={files[activeTab].language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        fontSize: "0.85rem",
                        lineHeight: "1.6",
                        backgroundColor: "transparent",
                        minHeight: "100px"
                    }}
                    codeTagProps={{
                        className: "font-mono"
                    }}
                >
                    {files[activeTab].code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

