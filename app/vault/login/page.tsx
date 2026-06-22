import VaultLogin from "../../components/VaultLogin";

export default async function VaultLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  // Apenas caminhos internos relativos (evita open redirect).
  const redirectTo =
    from && from.startsWith("/") && !from.startsWith("//") ? from : "/vault";

  return <VaultLogin redirectTo={redirectTo} />;
}
