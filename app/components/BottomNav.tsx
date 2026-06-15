"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "📀", label: "Coleção" },
  { href: "/journey", icon: "🧭", label: "Jornada" },
  { href: "/feed", icon: "📰", label: "Feed" },
  { href: "/coming", icon: "⏳", label: "Por Vir" },
  { href: "/essay", icon: "✍️", label: "Ensaio" },
  { href: "/insights", icon: "📊", label: "Análises" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-3 right-3 z-50 rounded-[2rem] border border-[#3a3025] bg-black/90 px-3 py-3 shadow-2xl backdrop-blur">
      <div className="grid grid-cols-6 gap-1 text-center text-[10px] text-[#f4ead8]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 pt-2"
            >
              {isActive && (
                <span className="absolute top-0 h-1 w-8 rounded-full bg-brand-yellow" />
              )}

              <span className="text-lg">{item.icon}</span>

              <span className={isActive ? "text-brand-yellow" : undefined}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
