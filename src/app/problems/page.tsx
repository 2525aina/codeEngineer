"use client";

import { useEffect, useState } from "react";
import { getProblems } from "@/app/actions/problem";
import { CodingProblem } from "@/types";
import Link from "next/link";
import { Clock, Tag, ChevronRight, BookOpen, Search, Sparkles } from "lucide-react";

export default function Problems() {
    const [problems, setProblems] = useState<CodingProblem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        async function fetchProblems() {
            const data = await getProblems();
            setProblems(data);
            setLoading(false);
        }
        fetchProblems();

        const handleScroll = () => {
            // ヘッダーを通り過ぎたら（約400px）追従バーを表示
            if (window.scrollY > 200) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filteredProblems = problems.filter(p => {
        const query = searchQuery.toLowerCase();
        return (
            p.title.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.difficulty.toLowerCase().includes(query) ||
            p.context.toLowerCase().includes(query) ||
            p.techStack.some(t => t.toLowerCase().includes(query)) ||
            p.problemTypes.some(t => t.toLowerCase().includes(query))
        );
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "tutorial": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "easy": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "medium": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
            case "hard": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "demon": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-secondary bg-secondary/10 border-secondary/20";
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-secondary font-medium animate-pulse">データを読み込み中...</p>
        </div>
    );

    return (
        <>
            <div className="space-y-12 max-w-6xl mx-auto pb-20 relative">
                {/* Sticky Search Bar - Fades in on scroll */}
                <div
                    className={`fixed top-16 left-0 right-0 z-30 transition-all duration-500 transform ${isSticky
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "-translate-y-4 opacity-0 pointer-events-none"
                        }`}
                >
                    <div className="container mx-auto px-4 py-3">
                        <div className="max-w-6xl mx-auto flex justify-end">
                            <div className="relative group w-full md:w-80 shadow-2xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="クイック検索..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-primary/30 text-white text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="relative overflow-hidden rounded-[30px] md:rounded-[40px] p-6 md:p-10 lg:p-16 glass border animate-reveal">
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8">
                        <div className="space-y-4 text-center lg:text-left w-full lg:w-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                <Sparkles className="w-3 h-3" />
                                <span>Library</span>
                            </div>
                            <h1 className="flex flex-col lg:block">
                                <span className="text-[8vw] md:text-5xl lg:text-6xl font-black tracking-tight block">
                                    <span className="text-google-gradient italic">戦歴 </span>を、<span className="text-google-gradient italic">振り返る </span>。
                                </span>
                            </h1>
                            <div className="text-secondary text-sm md:text-base lg:text-lg max-w-2xl mt-4">
                                <p>これまで挑んだ {problems.length} の戦場。</p>
                                <p>解決したバグの数だけ、あなたは強くなった。</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto">
                            <Link
                                href="/generate"
                                className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-center shadow-xl hover:scale-105 active:scale-95 transition-all text-sm md:text-base flex-1 lg:flex-none"
                            >
                                生成する
                            </Link>
                            <div className="relative group flex-1 lg:flex-none">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="タイトル、技術、タグで検索..."
                                    className="w-full lg:w-72 pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-black/50 border border-white/20 focus:ring-2 focus:ring-primary outline-none text-sm transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {problems.length === 0 ? (
                    <div className="text-center py-32 glass rounded-[40px] border border-dashed space-y-6">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <BookOpen className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">まだ過去問がありません</h3>
                            <p className="text-secondary">最初の問題はあなたの手で生み出されるのを待っています。</p>
                        </div>
                        <Link href="/generate" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">
                            生成する <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : filteredProblems.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-muted">
                        <p className="text-secondary font-bold">&quot; {searchQuery} &quot; に一致する問題は見つかりませんでした。</p>
                        <button onClick={() => setSearchQuery("")} className="mt-4 text-primary text-sm font-bold border-b border-primary/30 pb-0.5 hover:border-primary transition-all">
                            検索をリセット
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-reveal">
                        {filteredProblems.map((problem, index) => (
                            <Link
                                key={problem.id}
                                href={`/problems/${problem.id}`}
                                className="group relative block p-8 rounded-[32px] glass hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-500 border hover:border-primary/50 overflow-hidden shadow-sm"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Hover accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[10px] text-secondary font-mono">
                                            <Clock className="w-3 h-3" />
                                            {new Date(problem.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {problem.title}
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-blue-500/10">
                                                <Tag className="w-2.5 h-2.5" />
                                                {problem.category}
                                            </span>
                                            {problem.techStack.slice(0, 3).map(tech => (
                                                <span key={tech} className="bg-white/40 dark:bg-black/40 px-2 py-1 rounded-lg text-[10px] text-secondary font-medium border border-white/10">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full border-2 border-background bg-blue-500" />
                                                <div className="w-6 h-6 rounded-full border-2 border-background bg-purple-500" />
                                            </div>
                                            <div className="flex items-center text-primary font-black text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all uppercase">
                                                みる <ChevronRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    );
}
