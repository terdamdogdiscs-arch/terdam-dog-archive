"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "📀", label: "Coleção" },
  { href: "/journey", icon: "🧭", label: "História" },
  { href: "/discover", icon: "✨", label: "Descoberta" },
  { href: "/feed", icon: "📰", label: "Feed" },
  { href: "/coming", icon: "⏳", label: "Por vir" },
  { href: "/insights", icon: "📊", label: "Dados" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 top-0 z-50 hidden border-b border-[#2b241c] bg-[#0c0c0c]/95 backdrop-blur lg:block"
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">📀</span>
            <span className="font-black tracking-[0.16em] text-brand-yellow">
              TERDAM DOG
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-brand-yellow text-black"
                      : "text-[#b8aa91] hover:bg-[#1a1713] hover:text-[#f4ead8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-2 left-2 right-2 z-50 rounded-[1.5rem] border border-[#3a3025] bg-black/95 px-2 py-2 shadow-2xl backdrop-blur lg:hidden"
      >
        <div className="grid grid-cols-6 gap-1 text-center text-[11px] text-[#f4ead8]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl pt-1"
              >
                {isActive && (
                  <span className="absolute top-0 h-0.5 w-7 rounded-full bg-brand-yellow" />
                )}

                <span className="text-base" aria-hidden="true">{item.icon}</span>
                <span className={isActive ? "text-brand-yellow" : undefined}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
