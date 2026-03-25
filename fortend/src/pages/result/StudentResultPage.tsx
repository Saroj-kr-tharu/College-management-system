import { useEffect, useState } from "react";
import type { IResult, IMark } from "../../types/result.types";
import { getMyResult } from "../../api/result.api";

// Helpers

const getClassName = (cls: IResult["class"]) =>
  typeof cls === "object" ? cls.name : cls;

const getCourseName = (course: IMark["course"]) =>
  typeof course === "object" ? `${course.name} (${course.code})` : course;

const gradeColor = (grade: string) => {
  switch (grade?.toUpperCase()) {
    case "A+":
    case "A":
      return "text-emerald-400";
    case "B+":
    case "B":
      return "text-sky-400";
    case "C+":
    case "C":
      return "text-amber-400";
    case "D":
      return "text-orange-400";
    case "F":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
};

const statusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pass":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
    case "fail":
      return "bg-red-500/10 text-red-400 border border-red-500/25";
    default:
      return "bg-sky-500/10 text-sky-300 border border-sky-500/25";
  }
};

// CGPA to progress bar width
const cgpaPercent = (cgpa: number) =>
  Math.min(100, Math.round((cgpa / 4) * 100));

// Skeleton

const SkeletonCard = () => (
  <div className="bg-[#0a1628]/80 border border-[#1a2e4a] rounded-2xl p-5 space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 w-32 bg-[#1a2e4a] rounded" />
      <div className="h-5 w-14 bg-[#1a2e4a] rounded-full" />
    </div>
    <div className="h-3 w-48 bg-[#1a2e4a] rounded" />
    <div className="h-2 w-full bg-[#1a2e4a] rounded-full mt-2" />
  </div>
);

// Result Card

function ResultCard({ result }: { result: IResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#0a1628] to-[#081020] border border-[#1a2e4a] rounded-2xl overflow-hidden shadow-lg shadow-black/20 transition-all duration-200">

      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full text-left px-5 py-4 cursor-pointer hover:bg-sky-500/5 transition-colors duration-150"
      >
        <div className="flex items-start justify-between gap-3">

          {/* Left info */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold text-sm">{result.program}</span>
              <span className="text-[#3a5070] text-xs">•</span>
              <span className="text-sky-400/80 text-xs font-medium">Semester {result.semester}</span>
              <span className="text-[#3a5070] text-xs">•</span>
              <span className="text-[#6a80a0] text-xs">{getClassName(result.class)}</span>
            </div>

            {/* CGPA bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[#0f2040] rounded-full overflow-hidden max-w-[160px]">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${cgpaPercent(result.cgpa)}%` }}
                />
              </div>
              <span className="text-sky-400 font-bold text-sm tabular-nums">
                {result.cgpa?.toFixed(2)} <span className="text-[#3a5070] font-normal text-xs">/ 4.00</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#4a6080] text-xs">
                {result.marks?.length ?? 0} course{result.marks?.length !== 1 ? "s" : ""}
              </span>
              {result.createdAt && (
                <>
                  <span className="text-[#3a5070] text-xs">•</span>
                  <span className="text-[#4a6080] text-xs">
                    {new Date(result.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: status + chevron */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(result.overallStatus)}`}>
              {result.overallStatus}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              className={`text-sky-500/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded marks detail */}
      {expanded && (
        <div className="border-t border-[#1a2e4a] px-5 py-4">
          {!result.marks?.length ? (
            <p className="text-[#3a5070] text-sm text-center py-4">No mark details available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#1a2e4a]">
                    <th className="pb-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">#</th>
                    <th className="pb-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Course</th>
                    <th className="pb-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Year</th>
                    <th className="pb-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Type</th>
                    <th className="pb-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Mark</th>
                    <th className="pb-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Grade</th>
                    <th className="pb-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-[#3a5070]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.marks.map((m, i) => (
                    <tr
                      key={m._id}
                      className="border-b border-[#0f2035]/60 last:border-b-0 hover:bg-sky-500/5 transition-colors duration-100"
                    >
                      <td className="py-2.5 text-xs text-[#3a5070]">{i + 1}</td>
                      <td className="py-2.5 text-[#c8d8f0] font-medium pr-4">
                        {getCourseName(m.course)}
                      </td>
                      <td className="py-2.5 text-center text-[#6a80a0] text-xs">{m.examYear}</td>
                      <td className="py-2.5 text-center">
                        <span className="bg-sky-500/10 border border-sky-500/20 text-sky-300 rounded-md px-2 py-0.5 text-xs font-medium">
                          {m.examType}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-bold text-[#c8d8f0] tabular-nums">
                        {m.isAbsent ? (
                          <span className="text-[#3a5070] font-normal italic text-xs">Absent</span>
                        ) : (
                          m.mark
                        )}
                      </td>
                      <td className={`py-2.5 text-center font-bold tabular-nums ${gradeColor(m.grade)}`}>
                        {m.isAbsent ? "—" : m.grade}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          m.isAbsent
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : m.grade === "F"
                            ? "bg-red-500/10 text-red-400 border border-red-500/25"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        }`}>
                          {m.isAbsent ? "Absent" : m.grade === "F" ? "Fail" : "Pass"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main Page

export default function StudentResultPage() {
  const [results, setResults] = useState<IResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyResult();
        setResults(res.data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load your results");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Summary stats
  const totalResults = results.length;
  const passed = results.filter((r) => r.overallStatus?.toLowerCase() === "pass").length;
  const avgCgpa = results.length
    ? (results.reduce((sum, r) => sum + (r.cgpa ?? 0), 0) / results.length).toFixed(2)
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04101e] via-[#071525] to-[#060f1c] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 text-[#c8d8f0]">

      {/* Grid texture */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Glow accents */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-sky-400 mb-1.5">
            Academic Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">My Results</h1>
        </header>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Summary stats */}
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7">
            {[
              { label: "Total Semesters", value: totalResults },
              { label: "Passed", value: `${passed} / ${totalResults}` },
              { label: "Avg CGPA", value: avgCgpa },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-b from-[#0a1628] to-[#081020] border border-[#1a2e4a] rounded-2xl px-4 py-3.5 text-center"
              >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/20 to-transparent mb-3" />
                <p className="text-xl sm:text-2xl font-bold text-sky-400 tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-[#3a5070] font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && (
          <div className="bg-gradient-to-b from-[#0a1628] to-[#081020] border border-[#1a2e4a] rounded-2xl flex flex-col items-center justify-center py-20 gap-3 text-[#2a4060]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm">No results published yet.</p>
          </div>
        )}

        {/* Result cards */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-3">
            {results.map((r) => (
              <ResultCard key={r._id} result={r} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
