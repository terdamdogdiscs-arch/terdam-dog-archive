import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  // === DEBUG TEMPORÁRIO — REMOVER DEPOIS ===
  const envPw = process.env.VAULT_PASSWORD;
  console.log("VAULT_PASSWORD existe:", !!process.env.VAULT_PASSWORD);
  console.log("Tamanho da senha esperada:", process.env.VAULT_PASSWORD?.length);
  console.log("Tamanho da senha recebida:", password?.length);
  console.log("Match exato:", password === envPw);
  console.log("Match com trim:", password?.trim() === envPw?.trim());
  // === FIM DEBUG ===

  if (password && password === process.env.VAULT_PASSWORD) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("vault_access", "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
