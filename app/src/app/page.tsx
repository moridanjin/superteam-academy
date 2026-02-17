export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3">
        <div className="from-solana-purple to-solana-green h-10 w-10 rounded-lg bg-gradient-to-br" />
        <h1 className="text-3xl font-bold tracking-tight">Superteam Academy</h1>
      </div>
      <p className="max-w-md text-center text-neutral-400">
        Learn Solana development with interactive courses, on-chain credentials,
        and gamified progression.
      </p>
    </div>
  );
}
