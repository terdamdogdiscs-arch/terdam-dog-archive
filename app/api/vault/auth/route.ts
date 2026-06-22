import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

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
