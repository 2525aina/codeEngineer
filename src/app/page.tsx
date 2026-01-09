"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, LucideIcon, Eye, Check, Cpu, ShieldCheck, Globe } from "lucide-react";

export default function Home() {
  const [isSticky, setIsSticky] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: { line1: "コードを研げ。", line2: "知性を超えろ。" },
    desc: { line1: "教科書を捨て、実務の修羅場へ。", line2: "「不可避の欠陥」を、あなたの腕でねじ伏せろ。" }
  });

  useEffect(() => {
    // ランダムキャッチコピーのバリエーション
    const variations = [
      {
        title: { line1: "コードを研げ。", line2: "知性を超えろ。" },
        desc: { line1: "教科書を捨て、実務の修羅場へ。", line2: "「不可避の欠陥」を、あなたの腕でねじ伏せろ。" }
      },
      {
        title: { line1: "そのコードで、", line2: "耐えられるか。" },
        desc: { line1: "教科書通りの回答は、ここでは通用しない。", line2: "その「脆弱性」を、あなたは完全に見抜けるか。" }
      },
      {
        title: { line1: "AIをデバッグせよ。", line2: "真実はバグの中に。" },
        desc: { line1: "AIが生成するのは「正解」ではない、「罠」だ。", line2: "次世代のエンジニアに求められるのは、それを見破る力。" }
      },
      {
        title: { line1: "綺麗事を書くな。", line2: "動くものを書け。" },
        desc: { line1: "理論だけのアルゴリズム問題はもう終わり。", line2: "明日現場で直面するトラブルを、今日ここで解決しよう。" }
      },
      {
        title: { line1: "実務直結。", line2: "バグ混入済み。" },
        desc: { line1: "最強の教材は、失敗するコードだ。", line2: "その「設計ミス」こそが、あなたを強くする。" }
      },
      {
        title: { line1: "AIが壊し、", line2: "人間が創る。" },
        desc: { line1: "完全なコードなど存在しない。", line2: "AIが突きつける不完全さを、あなたの知性で補完せよ。" }
      }
    ];

    // ハイドレーション不一致を防ぐため、マウント後にランダム設定
    const random = variations[Math.floor(Math.random() * variations.length)];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroContent(random);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // ヒーローセクションを通り過ぎたら追従バーを表示
      if (window.scrollY > 500) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative -mt-10 overflow-hidden min-h-screen">
      {/* Sticky Action Bar */}
      <div
        className={`fixed top-16 left-0 right-0 z-30 transition-all duration-500 transform ${isSticky
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-xl mx-auto flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
            <Link
              href="/generate"
              className="flex-1 bg-primary text-white py-3 rounded-full font-bold text-sm text-center hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              挑戦を開始
            </Link>
            <Link
              href="/problems"
              className="flex-1 bg-white/10 text-white py-3 rounded-full font-bold text-sm text-center hover:bg-white/20 transition-all border border-white/10"
            >
              過去問を見る
            </Link>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[10%] w-[30vh] h-[30vh] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-red-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-20 md:pt-40 md:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 text-xs font-semibold text-primary mb-10 animate-reveal">
          <div className="flex -space-x-1 mr-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-white dark:ring-black" />
            <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
            <div className="w-4 h-4 rounded-full bg-yellow-500 ring-2 ring-white dark:ring-black" />
            <div className="w-4 h-4 rounded-full bg-green-500 ring-2 ring-white dark:ring-black" />
          </div>
          <span>Next-gen AI Problem Engineering</span>
        </div>

        {/* Title: 確実に2行で表示 */}
        <h1 className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto mb-8 animate-reveal min-h-[2em]">
          <span className="text-[10vw] md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.0] text-google-gradient whitespace-nowrap italic">
            {heroContent.title.line1}
          </span>
          <span className="text-[10vw] md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.0] text-black dark:text-white whitespace-nowrap">
            {heroContent.title.line2}
          </span>
        </h1>

        {/* Subtitle: 確実に2行で表示 */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mb-14 animate-reveal min-h-[3.5em]">
          <p className="text-[3.5vw] md:text-2xl text-secondary leading-relaxed opacity-90 whitespace-nowrap">
            {heroContent.desc.line1}
          </p>
          <p className="text-[3.5vw] md:text-2xl text-secondary leading-relaxed opacity-90 whitespace-nowrap">
            {heroContent.desc.line2}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center animate-reveal">
          <Link
            href="/generate"
            className="group relative bg-[#1a73e8] hover:bg-[#1557b0] text-white px-12 py-5 rounded-full font-black text-xl flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl active:scale-95 overflow-hidden"
          >
            挑戦を開始
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/problems"
            className="px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-foreground/80 border border-transparent hover:border-foreground/10"
          >
            過去問を見る
          </Link>
        </div>
      </section>

      {/* Visual Section - UI Rendering Preview */}
      <section className="container mx-auto px-6 mb-40 animate-reveal">
        <div className="relative max-w-5xl mx-auto">
          {/* Glowing Backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[40px] blur opacity-20 dark:opacity-40" />

          <div className="relative glass rounded-[40px] border shadow-2xl bg-white/60 dark:bg-black/60 overflow-hidden flex flex-col md:flex-row">
            {/* Simulated Editor Side */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 text-xs font-mono text-secondary">
                <span className="flex gap-1.5 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </span>
                <span>RequestLogger.java</span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-2">
                  <span className="text-blue-400">@RestController</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-400">public class</span> <span className="text-yellow-400">LogAnalyzer</span> {"{"}
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="text-blue-300">@PostMapping</span>(<span className="text-green-400">&quot;/stats&quot;</span>)
                </div>
                <div className="flex gap-2 ml-4 bg-primary/10 border-l-2 border-primary px-2 py-0.5 animate-pulse">
                  <span className="text-red-400">{/* // TODO: Calculate P99... */}</span>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="text-secondary opacity-50 italic">{/* // Logic here */}</span>
                </div>
                <div className="flex gap-2">
                  {"}"}
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>AI Feedback</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    このコードには並行処理におけるスレッドセーフの欠如と、メモリーリークの可能性があります。
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Problem Description Side */}
            <div className="w-full md:w-80 bg-white/40 dark:bg-black/40 p-8 flex flex-col gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-full">MEDIUM</span>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">JAVA</span>
                </div>
                <h4 className="font-bold leading-tight">高負荷APIにおける集計ロジックの修正</h4>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-secondary uppercase tracking-widest">Requirements</h5>
                <ul className="space-y-2">
                  {[
                    "並行リクエスト下での正確な集計",
                    "メモリ使用量の最小化",
                    "例外処理の堅牢性"
                  ].map((text, i) => (
                    <li key={i} className="flex gap-2 text-xs text-secondary">
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto space-y-4">
                <div className="text-xs font-mono bg-muted/50 p-3 rounded-xl border border-white/5 truncate">
                  id: aedb929f-3a6a...
                </div>
                <button className="w-full bg-primary/10 text-primary py-3 rounded-xl font-bold text-sm
                   hover:bg-primary/20 transition-all
                   flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>解答と解説を見る</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute -top-6 -right-6 animate-float">
            <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-3xl shadow-2xl border flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-secondary">Logic Grade</div>
                <div className="text-sm font-black">Tier-S Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={Cpu}
            title="次世代 Gemini エンジン"
            desc="Googleの最新AI（Gemini 3 Pro / Flash）が、あなたの技術スタックと言語に合わせた「今、解くべき」問題を瞬時に思考。"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="実務直結ロジック"
            desc="単なる書き換えではありません。設計の歪み、セキュリティ欠陥、そしてパフォーマンスの壁を体験。"
          />
          <FeatureCard
            icon={Globe}
            title="パーソナライズ"
            desc="難易度は「チュートリアル」から「魔王級」まで。文脈に合わせた追加指示も自在に設定可能。"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 pb-32">
        <div className="glass bg-google-ai rounded-[48px] p-12 md:p-24 text-center card-shadow border">
          <h2 className="text-4xl md:text-6xl font-medium mb-8">あなたの可能性を、<br />解き放つ。</h2>
          <Link
            href="/settings"
            className="inline-block bg-[#1a73e8] text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-[0_8px_30px_rgb(66,133,244,0.4)] transition-all active:scale-95 shadow-lg"
          >
            開始
          </Link>
          <p className="mt-8 text-secondary text-sm">特別な登録は不要。APIキーを設定するだけで全機能が解放されます。</p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="glass bg-google-ai rounded-[32px] p-8 space-y-6 group border hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-white/5">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-secondary leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
        {desc}
      </p>
    </div>
  )
}
