import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-3 right-3 z-50 rounded-[2rem] border border-[#3a3025] bg-black/90 px-3 py-3 shadow-2xl backdrop-blur">
      <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-[#f4ead8]">
        <Link href="/" className="flex flex-col items-center gap-1">
          <span className="text-lg">📀</span>
          <span>Coleção</span>
        </Link>

        <Link href="/journey" className="flex flex-col items-center gap-1">
          <span className="text-lg">🧭</span>
          <span>Jornada</span>
        </Link>

        <Link href="/curator" className="flex flex-col items-center gap-1">
          <span className="text-lg">✨</span>
          <span>Curadoria</span>
        </Link>

        <Link href="/essay" className="flex flex-col items-center gap-1">
          <span className="text-lg">✍️</span>
          <span>Ensaio</span>
        </Link>

        <Link href="/insights" className="flex flex-col items-center gap-1">
          <span className="text-lg">📊</span>
          <span>Análises</span>
        </Link>
      </div>
    </nav>
  );
}