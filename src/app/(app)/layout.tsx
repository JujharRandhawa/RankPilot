import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";

function ShellFallback() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-line/70" />
      <div className="mt-6 h-40 animate-pulse rounded-2xl bg-line/50" />
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
