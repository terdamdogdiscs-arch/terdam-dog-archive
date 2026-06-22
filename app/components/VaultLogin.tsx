"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VaultLogin({ redirectTo = "/vault" }: { redirectTo?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/vault/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace(redirectTo);
      router.refresh();
    } else {
      setError(true);
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="text-sm tracking-[0.35em] text-purple-400">COFRE PRIVADO</p>

        <h1 className="text-4xl font-black mt-4 leading-none">
          Acesso restrito
        </h1>

        <p className="text-[#b8aa91] mt-4 text-sm">
          Esta área exibe o valor financeiro da coleção. Digite a senha para
          desbloquear.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha do cofre"
            className="w-full rounded-2xl border border-brand-purple bg-[#120f0b] p-4 text-[#f4ead8] outline-none focus:border-purple-400"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">Senha incorreta.</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full rounded-2xl border border-brand-purple bg-purple-950/30 py-4 font-black tracking-wide text-purple-200 transition hover:bg-purple-900/40 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Desbloquear"}
          </button>
        </form>

        <a href="/" className="mt-6 inline-block text-sm text-[#9d9079]">
          ← Voltar à coleção
        </a>
      </div>
    </main>
  );
}
