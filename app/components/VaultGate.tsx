import { cookies } from "next/headers";
import VaultLogin from "./VaultLogin";

export default async function VaultGate({
  children,
  redirectTo = "/vault",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const cookieStore = await cookies();
  const granted = cookieStore.get("vault_access")?.value === "granted";

  if (!granted) {
    return <VaultLogin redirectTo={redirectTo} />;
  }

  return <>{children}</>;
}
