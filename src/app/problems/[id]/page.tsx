"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProblemById } from "@/app/actions/problem";
import { CodingProblem } from "@/types";
import CodeBlock from "@/components/CodeBlock";
import MarkdownCodeBlock from "@/components/MarkdownCodeBlock";
import ReactMarkdown from "react-markdown";
import { ChevronLeft, Eye, EyeOff, Lightbulb, Info, FileCode, CheckCircle, Terminal } from "lucide-react";
import Link from "next/link";

// ReactMarkdown のカスタムコンポーネント
const markdownComponents = {
    // 太字を確実に強調。!重要フラグを使用して他のスタイルによる上書きを防止。
    strong: ({ children }: any) => <strong className="!font-black !text-blue-600 dark:!text-blue-400">{children}</strong>,
    b: ({ children }: any) => <b className="!font-black !text-blue-600 dark:!text-blue-400">{children}</b>,

    // リストのスタイリング
    ul: ({ children }: any) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,

    // コードブロックは pre レベルで処理してネスト問題を回避
    pre: ({ children }: any) => {
        // children から code 要素の props を取得
        const codeElement = children?.props;
        if (codeElement) {
            const className = codeElement.className || "";
            const code = String(codeElement.children || "");
            return <MarkdownCodeBlock className={className}>{code}</MarkdownCodeBlock>;
        }
        return <pre>{children}</pre>;
    },
    // code は pre 内で処理されるのでスキップ（インラインコードのみ処理）
    code: ({ inline, className, children, ...props }: any) => {
        // インラインコードのプレミアムなスタイリング
        return (
            <code
                className={`${className} bg-primary/10 text-primary dark:text-blue-400 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] font-medium border border-primary/10`}
                {...props}
            >
                {children}
            </code>
        );
    },
};

export default function ProblemDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [problem, setProblem] = useState<CodingProblem | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        async function fetchProblem() {
            if (!id) return;
            const data = await getProblemById(id as string);
            if (data) {
                setProblem(data);
            }
            setLoading(false);
        }
        fetchProblem();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20">読み込み中...</div>;
    if (!problem) return <div className="text-center py-20">問題が見つかりませんでした。</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            <Link href="/problems" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4">
                <ChevronLeft className="w-4 h-4" />
                過去問に戻る
            </Link>

            {/* Header / Actions */}
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded text-xs font-bold border uppercase bg-secondary/10">
                        {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold border uppercase bg-primary/10 text-primary border-primary/20">
                        {problem.category}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold">{problem.title}</h1>
                <div className="flex flex-wrap gap-2 pt-2">
                    {problem.techStack.map(tech => (
                        <span key={tech} className="bg-muted px-2 py-1 rounded text-xs text-secondary font-medium">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-10">
                    {/* Context / Requirements */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Info className="w-6 h-6 text-blue-500" />
                            業務背景と要件
                        </h2>
                        <div className="prose dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none bg-muted/20 p-6 rounded-2xl border border-muted">
                            <ReactMarkdown components={markdownComponents}>
                                {(problem.context || "")
                                    .replace(/\\\*/g, '*')
                                    .replace(/\*\*(.*?)\*\*/g, ' **$1** ')}
                            </ReactMarkdown>
                        </div>
                    </section>

                    {/* Problem Code */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FileCode className="w-6 h-6 text-orange-500" />
                            問題のコード
                        </h2>
                        <CodeBlock code={problem.problemCode} />
                    </section>

                    {/* Solution Toggle Section */}
                    <div className="pt-8 space-y-8">
                        <button
                            onClick={() => setShowAnswer(!showAnswer)}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${showAnswer
                                ? "bg-muted text-secondary border hover:bg-muted/80"
                                : "bg-primary text-white shadow-lg hover:opacity-90 active:scale-[0.98]"
                                }`}
                        >
                            {showAnswer ? (
                                <>
                                    <EyeOff className="w-6 h-6" />
                                    解答と解説を隠す
                                </>
                            ) : (
                                <>
                                    <Eye className="w-6 h-6" />
                                    解答と解説を見る
                                </>
                            )}
                        </button>

                        {showAnswer && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-6 h-6" />
                                        正解・修正後のコード
                                    </h2>
                                    <CodeBlock code={problem.solutionCode} />
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-600">
                                        <Lightbulb className="w-6 h-6" />
                                        解説
                                    </h2>
                                    <div className="prose dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none bg-yellow-50/30 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-200/50">
                                        <ReactMarkdown components={markdownComponents}>
                                            {(problem.explanation || "")
                                                .replace(/\\\*/g, '*')
                                                .replace(/\*\*(.*?)\*\*/g, ' **$1** ')}
                                        </ReactMarkdown>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="p-6 rounded-2xl border bg-card space-y-6 sticky top-24">
                        {/* AI Request Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold border-b pb-2 flex items-center gap-2 text-sm">
                                <Terminal className="w-4 h-4 text-primary" />
                                AIへの依頼内容
                            </h3>
                            {problem.options ? (
                                <div className="space-y-3 text-[11px]">
                                    <div className="flex justify-between border-b border-muted pb-1">
                                        <span className="text-secondary">カテゴリ</span>
                                        <span className="font-medium">{problem.options.category}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-muted pb-1">
                                        <span className="text-secondary">難易度</span>
                                        <span className="font-medium capitalize">{problem.options.difficulty}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-secondary">技術スタック</span>
                                        <div className="flex flex-wrap gap-1">
                                            {[...(problem.options.frontendStack || []), ...(problem.options.backendStack || []), ...(problem.options.database || [])].map(t => (
                                                <span key={t} className="bg-muted px-1.5 py-0.5 rounded text-[9px]">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {problem.options.customInstructions && (
                                        <div className="space-y-1">
                                            <span className="text-secondary">追加指示</span>
                                            <p className="bg-muted/50 p-2 rounded italic text-secondary leading-[1.4]">
                                                {problem.options.customInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[11px] text-secondary italic text-center py-2">依頼内容のデータがありません</p>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-bold border-b pb-2 text-sm">この問題のテーマ</h3>
                            <ul className="space-y-2">
                                {problem.problemTypes.map(type => (
                                    <li key={type} className="flex items-center gap-2 text-xs text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {type}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-[10px] text-secondary/70">
                                生成日: {new Date(problem.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                            </p>
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="w-full text-[10px] text-secondary hover:text-primary transition-colors text-center pt-2"
                        >
                            問題を印刷する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
