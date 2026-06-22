import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exibem o valor financeiro da coleção e exigem o cookie de acesso.
const PROTECTED_PREFIXES = ["/vault"];
const PUBLIC_PATHS = ["/vault/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A própria tela de login é pública.
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isProtected) return NextResponse.next();

  const granted = request.cookies.get("vault_access")?.value === "granted";

  if (granted) return NextResponse.next();

  const loginUrl = new URL("/vault/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/vault/:path*"],
};
