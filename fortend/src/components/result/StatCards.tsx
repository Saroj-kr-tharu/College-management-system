interface Stat {
  label: string;
  value: number | string;
  color: string;
}

interface StatCardsProps {
  total: number;
  passed: number;
  failed: number;
  avgCgpa: string;
}

export default function StatCards({ total, passed, failed, avgCgpa }: StatCardsProps) {
  const stats: Stat[] = [
    { label: "Total Results", value: total,   color: "text-violet-400" },
    { label: "Passed",        value: passed,  color: "text-emerald-400" },
    { label: "Failed",        value: failed,  color: "text-red-400" },
    { label: "Avg CGPA",      value: avgCgpa, color: "text-fuchsia-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl px-4 py-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
          <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          <p className="text-[11px] text-[#4a3570] uppercase tracking-wider mt-1 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}