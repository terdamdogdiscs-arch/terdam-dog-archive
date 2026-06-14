import BottomNav from "../components/BottomNav";
import Link from "next/link";

export default function SessionsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24">
      <Link href="/" className="text-purple-400">
        ← Voltar
      </Link>

      <h1 className="text-4xl font-bold mt-8 mb-6">
        🎧 Sessions
      </h1>

      <div className="border border-gray-800 rounded p-6">
        <h2 className="text-2xl font-bold">
          Session #001
        </h2>

        <p className="text-gray-400 mt-2">
          Reggae → Hip-Hop → Jazz
        </p>

        <div className="mt-6 space-y-2">
          <div>#001 Black Alien</div>
          <div>#002 Junior Byles</div>
          <div>#004 Toots & The Maytals</div>
          <div>#007 Shinehead</div>
          <div>#008 Eric B. & Rakim</div>
          <div>#010 Fugees</div>
          <div>#013 Guru</div>
          <div>#014 Sonny Rollins</div>
          <div>#019 Sergio Mendes & Brasil '66</div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}