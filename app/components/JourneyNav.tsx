"use client";

type NavItem = {
  id: string;
  title: string;
  icon: string;
  count: number;
  range: string;
  border: string;
  text: string;
};

export default function JourneyNav({ items }: { items: NavItem[] }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => scrollTo(item.id)}
          className={`flex flex-col items-start rounded-2xl border ${item.border} bg-[#11100e] px-4 py-3 text-left transition hover:opacity-80`}
        >
          <span className={`text-sm font-black ${item.text}`}>
            {item.icon} {item.title}
          </span>

          <span className="mt-1 text-[11px] text-[#9d9079]">
            {item.count} {item.count === 1 ? "disco" : "discos"} · {item.range}
          </span>
        </button>
      ))}
    </div>
  );
}
