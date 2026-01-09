"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateAndSaveProblem } from "@/app/actions/problem";
import { Category, Difficulty, GenerationOptions } from "@/types";
import { MODELS } from "@/lib/gemini";
import { Loader2, Sparkles, AlertCircle, Check, MessageSquare, Cpu, Terminal, Zap, Layers, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES: Category[] = ["Frontend", "Backend", "Fullstack"];
const DIFFICULTIES: Difficulty[] = ["tutorial", "easy", "medium", "hard", "demon"];

const FRONTEND_STACKS = [
    "HTML", "CSS", "JavaScript", "React", "Next.js (App Router)", "Next.js (Pages Router)",
    "Vue", "Nuxt", "Svelte", "Tailwind CSS", "Bootstrap", "Material UI"
];

const BACKEND_STACKS = [
    "Node.js + Express", "Node.js + NestJS", "Python + Fast API", "Python + Django",
    "Go + Gin", "Go + Echo", "Ruby + Rails", "PHP + Laravel", "Java + Spring Boot"
];

const DATABASES = ["PostgreSQL", "MySQL", "MongoDB", "Firestore", "Redis", "SQLite"];

const PROBLEM_TYPES = [
    "バグ修正", "実装穴埋め", "設計・責務分離", "セキュリティ欠陥",
    "パフォーマンス改善", "テスト設計", "非同期処理の問題"
];

function GenerateContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [options, setOptions] = useState<GenerationOptions>({
        category: "Frontend",
        frontendStack: ["React", "Tailwind CSS"],
        backendStack: [],
        database: [],
        difficulty: "medium",
        problemTypes: ["バグ修正"],
        customInstructions: "",
        model: "gemini-2.0-flash-001"
    });

    const searchParams = useSearchParams();
    const modelParam = searchParams.get("model");

    useEffect(() => {
        if (modelParam && MODELS.some(m => m.id === modelParam)) {
            setOptions(prev => ({ ...prev, model: modelParam as any }));
        }
    }, [modelParam]);

    useEffect(() => {
        async function checkAvailable() {
            const { getSessionData } = await import("@/app/actions/problem");
            const session = await getSessionData();
            const connected = [];
            if (session.geminiApiKey) {
                // 旧形式のキーがある場合は暫定的に全モデル許可
                connected.push(...MODELS.map(m => m.id));
            }
            if (session.modelApiKeys) {
                connected.push(...Object.keys(session.modelApiKeys));
            }
            setAvailableModels(Array.from(new Set(connected)));
        }
        checkAvailable();
    }, []);

    const toggleItem = (list: string[] | undefined, item: string) => {
        const current = list || [];
        return current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
    };

    const handleModelSelect = (modelId: string) => {
        const isAvailable = availableModels.includes(modelId);
        if (!isAvailable) {
            window.location.href = `/settings#model-${modelId}`;
            return;
        }
        setOptions({ ...options, model: modelId as any });
    };

    const handleGenerate = () => {
        const isAvailable = availableModels.includes(options.model || "");
        if (!isAvailable) {
            window.location.href = `/settings#model-${options.model}`;
            return;
        }
        setShowConfirm(true);
    };

    const [openSections, setOpenSections] = useState<number[]>([1]); // Default open section 1

    useEffect(() => {
        // On larger screens, open all by default
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setOpenSections([1, 2]);
        }
    }, []);

    const toggleSection = (id: number) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const confirmGenerate = async () => {
        setShowConfirm(false);
        setLoading(true);
        setError("");
        try {
            const result = await generateAndSaveProblem(options);
            if (result.success) {
                router.push(`/problems/${result.id}`);
            }
        } catch (err: any) {
            setError(err.message || "問題の生成に失敗しました。設定画面でAPIキーを確認してください。");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-reveal relative">
                {/* Header */}
                <div className="space-y-4 text-center px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Problem Engineering Console</span>
                    </div>
                    <h1 className="flex flex-col items-center justify-center w-full">
                        <span className="text-[8vw] md:text-7xl font-black tracking-tighter whitespace-nowrap block">
                            <span className="text-google-gradient italic">AI </span>に、<span className="text-google-gradient italic">挑戦状 </span>を送る。
                        </span>
                    </h1>
                    <div className="text-secondary text-sm md:text-lg max-w-4xl mx-auto opacity-80 leading-relaxed mt-4 flex flex-col items-center">
                        <p className="whitespace-nowrap w-full text-center text-[4vw] md:text-lg">AI が牙を剥く。あなたの技術スタックに合わせた</p>
                        <p className="whitespace-nowrap w-full text-center text-[4vw] md:text-lg">「最悪のシナリオ（バグ）」を生成せよ。</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 md:px-0">
                    {/* Configuration Panel */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        {/* Step 1: Core Config */}
                        <div className="glass rounded-[32px] md:rounded-[40px] border overflow-hidden">
                            <button
                                onClick={() => toggleSection(1)}
                                className="w-full flex items-center justify-between p-6 md:p-10 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black shrink-0">1</div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">基本パラメーター</h2>
                                        {!openSections.includes(1) && (
                                            <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
                                                {options.model?.split('-').slice(0, 2).join(' ') || 'Select Model'} / {options.difficulty} / {options.category}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {openSections.includes(1) ? <ChevronUp className="w-6 h-6 text-secondary" /> : <ChevronDown className="w-6 h-6 text-secondary" />}
                            </button>

                            <div className={`p-6 md:p-10 space-y-10 transition-all ${openSections.includes(1) ? "block" : "hidden"}`}>
                                {/* Gemini Model Selection */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-secondary uppercase flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-yellow-500" /> AI エンジン (Gemini Model)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {MODELS.map(model => {
                                            const isAvailable = availableModels.includes(model.id);
                                            return (
                                                <button
                                                    key={model.id}
                                                    onClick={() => handleModelSelect(model.id)}
                                                    className={`px-4 py-3 rounded-2xl border transition-all text-left relative overflow-hidden ${options.model === model.id
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                                        : isAvailable
                                                            ? "bg-white/40 dark:bg-black/40 border-white/10 hover:bg-white/60"
                                                            : "bg-black/5 dark:bg-white/5 border-dashed border-white/5 opacity-40 hover:opacity-100 transition-opacity"
                                                        }`}
                                                >
                                                    <div className="text-xs font-bold leading-tight">{model.name}</div>
                                                    <div className={`text-[10px] mt-1 font-black px-2 py-0.5 rounded-md inline-block ${options.model === model.id
                                                        ? "bg-white/20 text-white"
                                                        : isAvailable
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-red-500/10 text-red-500"
                                                        }`}>
                                                        {isAvailable ? model.tag : "未接続"}
                                                    </div>
                                                    {options.model === model.id && (
                                                        <div className="absolute top-1 right-2 animate-pulse">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Category */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-secondary uppercase flex items-center gap-2">
                                            <Layers className="w-4 h-4" /> カテゴリ
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setOptions({
                                                        ...options,
                                                        category: cat,
                                                        frontendStack: cat === "Backend" ? [] : options.frontendStack,
                                                        backendStack: cat === "Frontend" ? [] : options.backendStack,
                                                        database: cat !== "Fullstack" ? [] : options.database
                                                    })}
                                                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${options.category === cat
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.05]"
                                                        : "bg-white/40 dark:bg-black/40 border-white/10 hover:bg-white/60"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-secondary uppercase flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> 難易度
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {DIFFICULTIES.map(diff => (
                                                <button
                                                    key={diff}
                                                    onClick={() => setOptions({ ...options, difficulty: diff })}
                                                    className={`px-4 py-2 rounded-xl border font-bold text-[11px] transition-all capitalize ${options.difficulty === diff
                                                        ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 scale-105"
                                                        : "bg-white/40 dark:bg-black/40 border-white/10"
                                                        }`}
                                                >
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Problem Types */}
                                <div className="space-y-4 pt-4">
                                    <label className="text-xs font-black text-secondary uppercase flex items-center gap-2">
                                        <Cpu className="w-4 h-4" /> 生成ロジックの焦点
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PROBLEM_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setOptions({
                                                    ...options,
                                                    problemTypes: toggleItem(options.problemTypes, type)
                                                })}
                                                className={`px-4 py-2 text-xs rounded-xl border font-bold transition-all ${options.problemTypes.includes(type)
                                                    ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20"
                                                    : "bg-white/20 dark:bg-black/20 border-white/5"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Tech Stacks */}
                        <div className="glass rounded-[32px] md:rounded-[40px] border overflow-hidden">
                            <button
                                onClick={() => toggleSection(2)}
                                className="w-full flex items-center justify-between p-6 md:p-10 border-b border-white/5 hover:bg-white/5 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black shrink-0">2</div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">技術スタックの定義</h2>
                                        {!openSections.includes(2) && (
                                            <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
                                                {[...(options.frontendStack || []), ...(options.backendStack || []), ...(options.database || [])].slice(0, 3).join(', ')} ...
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {openSections.includes(2) ? <ChevronUp className="w-6 h-6 text-secondary" /> : <ChevronDown className="w-6 h-6 text-secondary" />}
                            </button>

                            <div className={`p-6 md:p-10 space-y-10 transition-all ${openSections.includes(2) ? "block" : "hidden"}`}>
                                {(options.category === "Frontend" || options.category === "Fullstack") && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-secondary flex items-center gap-2">FRONTEND STACKS</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {FRONTEND_STACKS.map(stack => (
                                                <button
                                                    key={stack}
                                                    onClick={() => setOptions({
                                                        ...options,
                                                        frontendStack: toggleItem(options.frontendStack, stack)
                                                    })}
                                                    className={`text-left px-4 py-3 rounded-xl border text-xs flex justify-between items-center transition-all ${options.frontendStack?.includes(stack)
                                                        ? "border-primary bg-primary/10 text-primary font-bold shadow-inner"
                                                        : "bg-white/20 dark:bg-black/20 border-white/5"
                                                        }`}
                                                >
                                                    {stack}
                                                    {options.frontendStack?.includes(stack) && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(options.category === "Backend" || options.category === "Fullstack") && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-secondary flex items-center gap-2">BACKEND STACKS</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {BACKEND_STACKS.map(stack => (
                                                <button
                                                    key={stack}
                                                    onClick={() => setOptions({
                                                        ...options,
                                                        backendStack: toggleItem(options.backendStack, stack)
                                                    })}
                                                    className={`text-left px-4 py-3 rounded-xl border text-xs flex justify-between items-center transition-all ${options.backendStack?.includes(stack)
                                                        ? "border-green-500 bg-green-500/10 text-green-600 font-bold shadow-inner"
                                                        : "bg-white/20 dark:bg-black/20 border-white/5"
                                                        }`}
                                                >
                                                    {stack}
                                                    {options.backendStack?.includes(stack) && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {options.category === "Fullstack" && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-secondary flex items-center gap-2 uppercase tracking-tighter">Database</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {DATABASES.map(db => (
                                                <button
                                                    key={db}
                                                    onClick={() => setOptions({
                                                        ...options,
                                                        database: toggleItem(options.database, db)
                                                    })}
                                                    className={`text-left px-4 py-3 rounded-xl border text-xs flex justify-between items-center transition-all ${options.database?.includes(db)
                                                        ? "border-purple-500 bg-purple-500/10 text-purple-600 font-bold shadow-inner"
                                                        : "bg-white/20 dark:bg-black/20 border-white/5"
                                                        }`}
                                                >
                                                    {db}
                                                    {options.database?.includes(db) && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Custom Instructions & Action */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            {/* Custom Instructions */}
                            <div className="glass rounded-[40px] border p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold">AIへの追加指令</h3>
                                </div>
                                <p className="text-[10px] text-secondary leading-normal">
                                    選択した AI エンジンに特定の制約やトピックへの注力を指示できます（任意）。
                                </p>
                                <textarea
                                    placeholder="例: 非同期処理のエラーハンドリングを重点的に学べるようにしたい..."
                                    value={options.customInstructions}
                                    onChange={(e) => setOptions({ ...options, customInstructions: e.target.value })}
                                    className="w-full h-40 p-4 rounded-[24px] border bg-white/40 dark:bg-black/40 focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm placeholder:text-secondary/50 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button (Sticky-to-Static) */}
                <div className="sticky bottom-24 md:bottom-10 z-40 pointer-events-none">
                    <div className="max-w-2xl mx-auto px-4 pointer-events-auto text-center">
                        {error && (
                            <div className="w-full max-w-xl mx-auto bg-red-600 text-white p-3 rounded-2xl flex items-center gap-3 text-xs mb-4 animate-reveal shadow-[0_20px_40px_rgba(220,38,38,0.3)] border border-red-500/50">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="w-full relative group">
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-[32px] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="relative w-full bg-primary text-white py-6 rounded-[28px] font-black text-xl md:text-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        生成中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        問題を生成する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Static Notice Text - Pulled up with negative margin to counteract parent gap */}
                <div className="text-center !-mt-10 pb-12 px-4 relative z-0">
                    <p className="text-[11px] text-secondary font-bold tracking-tight opacity-60 leading-relaxed">
                        生成には数秒〜1分程度かかります。<br className="sm:hidden" />
                        ブラウザを閉じずにお待ちください。
                    </p>
                </div>
            </div>

            {/* Confirmation Modal - Fixed Viewport Position */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300 bg-white dark:bg-[#121212] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header Decor */}
                        <div className="h-2 bg-google-gradient w-full sticky top-0 z-[110]" />

                        <div className="p-8 md:p-12 text-center space-y-8">
                            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto border-2 border-primary/10 relative">
                                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                                <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full -z-10" />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white">
                                    🧑‍💻<span className="text-google-gradient italic">挑戦 </span>を<span className="text-google-gradient italic">開始 </span>🎌
                                </h2>
                                <p className="text-secondary text-sm font-medium">
                                    以下の条件で問題を生成します。よろしいですか？
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-left">
                                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Cpu className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black text-secondary tracking-widest uppercase">AI Engine</span>
                                    </div>
                                    <span className="font-mono text-xs font-bold">{options.model}</span>
                                </div>

                                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Level / Category</span>
                                    </div>
                                    <span className="font-bold text-xs capitalize">{options.difficulty} / {options.category}</span>
                                </div>

                                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 space-y-3 border border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Terminal className="w-4 h-4 text-blue-500" />
                                        <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Defined Stacks</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...(options.frontendStack || []), ...(options.backendStack || []), ...(options.database || [])].map(t => (
                                            <span key={t} className="bg-white/50 dark:bg-black/40 px-2 py-1 rounded-lg text-[10px] border border-black/10 dark:border-white/10 font-bold uppercase tracking-tighter">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                {options.customInstructions && (
                                    <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl p-4 space-y-2 border border-blue-500/10">
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Custom Instructions</span>
                                        </div>
                                        <p className="text-[11px] text-secondary italic leading-relaxed">
                                            "{options.customInstructions}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 bg-white dark:bg-[#121212] py-2 z-[110]">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-4 rounded-2xl border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-secondary text-sm"
                                >
                                    修正
                                </button>
                                <button
                                    onClick={confirmGenerate}
                                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-lg transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95"
                                >
                                    開始
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function Generate() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-secondary font-medium animate-pulse">読み込み中...</p>
            </div>
        }>
            <GenerateContent />
        </Suspense>
    );
}
