export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-teal-700";
  if (score >= 55) return "text-amber-600";
  return "text-rose-600";
}

export function scoreBg(score: number) {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-teal-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-rose-500";
}
