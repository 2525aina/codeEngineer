"use client";

import { useState, useEffect } from "react";
import { validateAndSaveApiKey, getSessionData, clearApiKeyForModel, clearAllApiKeys } from "@/app/actions/problem";
import { MODELS } from "@/lib/gemini";
import { Save, Trash2, CheckCircle, AlertCircle, ShieldCheck, Zap, Sparkles, Loader2, Cpu, ChevronRight, PlusCircle, Type, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [validatingModel, setValidatingModel] = useState<string | null>(null);
    const [isBulkValidating, setIsBulkValidating] = useState(false);
    const [bulkKey, setBulkKey] = useState("");
    const [error, setError] = useState<Record<string, string>>({});
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const data = await getSessionData();
            if (data.modelApiKeys) {
                const maskedKeys: Record<string, string> = {};
                Object.entries(data.modelApiKeys).forEach(([id, key]) => {
                    maskedKeys[id] = "********" + key.slice(-4);
                });
                setApiKeys(maskedKeys);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    // Handle initial hash scroll after loading
    useEffect(() => {
        if (!loading && typeof window !== "undefined") {
            const handleScrollToHash = () => {
                const hash = window.location.hash;
                if (!hash) return;

                const id = hash.slice(1);
                const element = document.getElementById(id);
                if (element) {
                    // Small delay to ensure everything is rendered
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                        // Add a highlight effect
                        element.classList.add("ring-4", "ring-primary", "ring-opacity-50", "transition-all", "duration-500");
                        setTimeout(() => {
                            element.classList.remove("ring-4", "ring-primary", "ring-opacity-50");
                        }, 3000);
                    }, 500);
                }
            };

            handleScrollToHash();
            // Also listen for hash changes
            window.addEventListener("hashchange", handleScrollToHash);
            return () => window.removeEventListener("hashchange", handleScrollToHash);
        }
    }, [loading]);

    const handleSave = async (modelId: string, rawKey: string) => {
        if (!rawKey || rawKey.includes("*")) return;

        setValidatingModel(modelId);
        setError(prev => ({ ...prev, [modelId]: "" }));

        try {
            await validateAndSaveApiKey(rawKey, modelId);
            setApiKeys(prev => ({ ...prev, [modelId]: "********" + rawKey.slice(-4) }));
            setSuccessMsg(`${modelId} の接続に成功しました。`);
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
            setError(prev => ({ ...prev, [modelId]: err.message || "接続に失敗しました。" }));
        } finally {
            setValidatingModel(null);
        }
    };

    const handleBulkSave = async () => {
        if (!bulkKey) return;
        setIsBulkValidating(true);
        setError(prev => ({ ...prev, bulk: "" }));

        try {
            const { validateAndSaveApiKeyForAll } = await import("@/app/actions/problem");
            const result = await validateAndSaveApiKeyForAll(bulkKey);

            const masked = "********" + bulkKey.slice(-4);
            const newKeys = { ...apiKeys };

            MODELS.forEach(m => {
                if (!result.failedModels.includes(m.id)) {
                    newKeys[m.id] = masked;
                }
            });

            setApiKeys(newKeys);
            setBulkKey("");

            if (result.failedModels.length > 0) {
                setSuccessMsg(`${result.count}個のモデルの接続に成功しましたが、${result.failedModels.length}個に失敗しました。`);
            } else {
                setSuccessMsg("すべてのモデルの接続が完了しました。");
            }
            setTimeout(() => setSuccessMsg(null), 5000);
        } catch (err: any) {
            setError(prev => ({ ...prev, bulk: err.message || "接続に失敗しました。" }));
        } finally {
            setIsBulkValidating(false);
        }
    };

    const handleBulkClear = async () => {
        if (!confirm("すべてのAPIキー設定を解除します。よろしいですか？")) return;
        await clearAllApiKeys();
        setApiKeys({});
        setSuccessMsg("すべての接続を解除しました。");
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleClear = async (modelId: string) => {
        await clearApiKeyForModel(modelId);
        setApiKeys(prev => {
            const next = { ...prev };
            delete next[modelId];
            return next;
        });
    };

    const [activeTab, setActiveTab] = useState<"visual" | "system">("system");

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-secondary font-medium animate-pulse">認証情報を読み込み中...</p>
        </div>
    );

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-12 pb-32 animate-reveal relative">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>System Configuration</span>
                    </div>
                    <h1 className="flex flex-col items-center justify-center w-full">
                        <span className="text-[8vw] md:text-7xl font-black tracking-tighter whitespace-nowrap block">
                            <span className="text-google-gradient italic">頭脳(AI) </span>を、<span className="text-google-gradient italic">調律 </span>する。
                        </span>
                    </h1>
                    <div className="text-secondary text-sm md:text-lg max-w-4xl mx-auto opacity-80 leading-relaxed mt-4 flex flex-col items-center">
                        <p className="whitespace-nowrap w-full text-center text-[3.5vw] md:text-lg">モデルごとにAPIキーを注入せよ。</p>
                        <p className="whitespace-nowrap w-full text-center text-[2.8vw] md:text-lg">あなたの戦術に合わせて、最適なニューラルネットワークを構成する。</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                    <div className="flex bg-black/5 dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/5">
                        <button
                            onClick={() => setActiveTab("system")}
                            className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === "system"
                                ? "bg-white dark:bg-[#1e1e1e] text-primary shadow-lg"
                                : "text-secondary hover:text-primary"
                                }`}
                        >
                            頭脳設定 (Neural Core)
                        </button>
                        <button
                            onClick={() => setActiveTab("visual")}
                            className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === "visual"
                                ? "bg-white dark:bg-[#1e1e1e] text-primary shadow-lg"
                                : "text-secondary hover:text-primary"
                                }`}
                        >
                            表示設定 (Visual)
                        </button>
                    </div>
                </div>

                {activeTab === "visual" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Font Theme Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                    <Type className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">フォントテーマ</h2>
                                    <p className="text-xs text-secondary">コードとUIの没入感を高めるタイポグラフィを選択。</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FontOption
                                    id="lora"
                                    name="Elegant"
                                    font="font-lora"
                                    description="Lora - 格調高いセリフ体"
                                />
                                <FontOption
                                    id="geist"
                                    name="Standard"
                                    font="font-geist"
                                    description="Geist - 洗練されたモダン"
                                />
                                <FontOption
                                    id="retro"
                                    name="Retro"
                                    font="font-retro"
                                    description="Courier - 伝統的な等幅体"
                                />
                                <FontOption
                                    id="sci-fi"
                                    name="Sci-Fi"
                                    font="font-sci-fi"
                                    description="Orbitron - 強烈な近未来感"
                                />
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "system" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Security Notice Banner */}
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-[32px] p-6 md:p-8 animate-reveal shadow-sm">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/10">
                                    <ShieldCheck className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-none mb-2">
                                        プライバシーとセキュリティ
                                    </h2>
                                    <span className="inline-block text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                        Private & Secure
                                    </span>
                                </div>
                            </div>

                            <p className="text-secondary text-xs md:text-sm leading-relaxed">
                                入力された API キーは、お客様のブラウザの <strong className="text-red-500 font-bold">暗号化された一時セッション（Cookie）のみに保存</strong> されます。
                                当サービスのデータベースに保存されたり、第三者に公開されることは一切ありません。
                                各モデルの「解除」ボタンを押すか、ブラウザのCookieを削除することで、いつでも情報を完全に消去できます。
                            </p>
                        </div>

                        {successMsg && (
                            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-reveal">
                                <CheckCircle className="w-6 h-6" />
                                {successMsg}
                            </div>
                        )}

                        {/* Bulk Setup Card */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">AIモデルの接続</h2>
                                    <p className="text-xs text-secondary">Gemini APIキーの設定と接続状態の管理。</p>
                                </div>
                            </div>

                            <div className="glass rounded-[40px] border p-8 md:p-10 space-y-6 border-primary/20 shadow-xl shadow-primary/5">
                                <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">すべてのモデルに一括設定</h2>
                                        <p className="text-xs text-secondary">一つのキーですべての最新エンジンを有効化します。</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1 w-full space-y-2">
                                        <input
                                            type="password"
                                            placeholder="AIzaSy... (API Key)"
                                            value={bulkKey}
                                            onChange={(e) => setBulkKey(e.target.value)}
                                            className="w-full px-6 py-4 rounded-2xl border bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm shadow-inner"
                                        />
                                        {error.bulk && <p className="text-[10px] text-red-500 font-bold ml-2">{error.bulk}</p>}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                        <button
                                            onClick={handleBulkSave}
                                            disabled={isBulkValidating || !bulkKey}
                                            className="flex-1 md:flex-none bg-primary text-white px-6 py-4 rounded-2xl font-black transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20"
                                        >
                                            {isBulkValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            一括接続
                                        </button>
                                        <button
                                            onClick={handleBulkClear}
                                            className="flex-1 md:flex-none bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-4 rounded-2xl font-black transition-all hover:bg-red-500/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            一括解除
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {MODELS.map((model) => (
                                    <div key={model.id} id={`model-${model.id}`} className="glass rounded-[32px] border p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative scroll-mt-24">
                                        {/* Model Info */}
                                        <div className="md:w-1/3 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <Cpu className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl">{model.name}</h3>
                                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                        {model.tag}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-secondary leading-relaxed">{model.description}</p>
                                        </div>

                                        {/* Input Area */}
                                        <div className="flex-1 w-full space-y-4">
                                            <div className="relative group">
                                                <input
                                                    type="password"
                                                    placeholder={apiKeys[model.id] ? "CONNECTED" : "AIzaSy... (API Key)"}
                                                    value={apiKeys[model.id] || ""}
                                                    onChange={(e) => setApiKeys({ ...apiKeys, [model.id]: e.target.value })}
                                                    disabled={!!apiKeys[model.id] && apiKeys[model.id].includes("*")}
                                                    className="w-full px-6 py-4 rounded-2xl border bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm shadow-inner"
                                                />
                                                {apiKeys[model.id]?.includes("*") && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-1.5 text-[10px] font-bold">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        CONNECTED
                                                    </div>
                                                )}
                                            </div>

                                            {error[model.id] && (
                                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {error[model.id]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Area */}
                                        <div className="md:w-72 w-full shrink-0">
                                            {apiKeys[model.id]?.includes("*") ? (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => window.location.href = `/generate?model=${model.id}`}
                                                        className="flex-[2] bg-primary/10 text-primary hover:bg-primary/20 font-bold py-4 rounded-2xl border border-primary/20 transition-all text-sm flex items-center justify-center gap-2 group"
                                                    >
                                                        <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        挑戦
                                                    </button>
                                                    <button
                                                        onClick={() => handleClear(model.id)}
                                                        className="flex-1 text-secondary hover:text-red-500 font-bold py-4 rounded-2xl border border-white/10 hover:border-red-500/20 bg-white/5 transition-all text-sm flex items-center justify-center gap-2 group"
                                                    >
                                                        <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                                                        解除
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSave(model.id, apiKeys[model.id] || "")}
                                                    disabled={validatingModel === model.id || !apiKeys[model.id]}
                                                    className="w-full bg-[#1a73e8] text-white py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                                >
                                                    {validatingModel === model.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Save className="w-5 h-5" />
                                                    )}
                                                    接続
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Guide Footer */}
                        <div className="max-w-3xl mx-auto glass rounded-[40px] border p-8 md:p-12 text-center space-y-6">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
                                <Zap className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">APIキーの取得方法</h3>
                                <p className="text-secondary text-sm">
                                    すべてのモデルは Google AI Studio から無料で取得可能な API キーで利用できます。<br className="hidden md:block" />
                                    モデルごとに異なるキーを使用することも、すべてに同じキーを使用することも可能です。
                                </p>
                            </div>
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-[#1a73e8] font-black text-lg hover:underline decoration-2 underline-offset-4"
                            >
                                Google AI Studio でキーを取得
                                <ChevronRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function FontOption({ id, name, font, description }: { id: any, name: string, font: string, description: string }) {
    const { fontTheme, setFontTheme } = useTheme();
    const active = fontTheme === id;

    return (
        <button
            onClick={() => setFontTheme(id)}
            className={`flex flex-col text-left p-4 rounded-3xl border transition-all duration-300 group relative overflow-hidden ${active
                ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-lg"
                : "bg-card border-muted hover:border-primary/40 hover:bg-muted/30"
                }`}
        >
            {active && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <Check className="w-3.5 h-3.5" />
                </div>
            )}
            <span className={`text-xl font-bold mb-1 ${font}`}>{name}</span>
            <span className="text-[10px] text-secondary leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                {description}
            </span>
            <div className={`mt-4 pt-4 border-t border-muted/30 w-full font-mono text-[9px] ${font}`}>
                The quick brown fox jumps over the lazy dog.
            </div>
        </button>
    );
}
