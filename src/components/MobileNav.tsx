"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, PlusCircle, Settings2, Home as HomeIcon } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "ホーム", icon: HomeIcon },
        { href: "/problems", label: "過去問", icon: List },
        { href: "/generate", label: "挑戦", icon: PlusCircle },
        { href: "/settings", label: "設定", icon: Settings2 },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-around items-end h-20 px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center justify-center w-full pb-3 transition-all duration-300"
                    >
                        <div
                            className={`flex flex-col items-center transition-all duration-300 ${isActive
                                ? "-translate-y-4"
                                : "translate-y-0"
                                }`}
                        >
                            <div
                                className={`p-3 rounded-2xl transition-all duration-300 ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/40 rotate-[360deg] scale-110"
                                    : "bg-transparent text-secondary"
                                    }`}
                            >
                                <Icon className={`w-6 h-6`} />
                            </div>
                            <span
                                className={`text-[10px] font-bold mt-1 transition-all duration-300 ${isActive ? "opacity-100 scale-100 text-primary" : "opacity-70 scale-90"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </div>
                        {isActive && (
                            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full animate-ping" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
