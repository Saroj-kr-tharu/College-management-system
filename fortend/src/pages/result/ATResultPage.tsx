import { useEffect, useState, useMemo } from "react";
import type { IResult } from "../../types/result.types";
import { getAllResults, deleteResult } from "../../api/result.api";
import ResultModal from "../../components/result/ResultModal";
import StatCards from "../../components/result/StatCards";
import ResultFilters, { type FilterState } from "../../components/result/ResultFilters";
import DetailModal from "../../components/result/DetailModal";

// Helpers

const getStudentName = (student: IResult["student"]) =>
  typeof student === "object" ? student.fullName : student;

const getClassName = (cls: IResult["class"]) =>
  typeof cls === "object" ? cls.name : cls;

const statusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pass": return { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", dot: "bg-emerald-400" };
    case "fail": return { badge: "bg-red-500/15 text-red-400 border border-red-500/25",             dot: "bg-red-400" };
    default:     return { badge: "bg-slate-500/15 text-slate-400 border border-slate-500/25",       dot: "bg-slate-400" };
  }
};

// Skeleton Row

const SkeletonRow = ({ i }: { i: number }) => (
  <tr style={{ opacity: 1 - i * 0.12 }}>
    {[...Array(8)].map((_, j) => (
      <td key={j} className="px-5 py-4">
        <div className="h-3.5 rounded-full bg-[#1e1535] animate-pulse" style={{ width: `${50 + (j * 13) % 40}%` }} />
      </td>
    ))}
  </tr>
);

// Page

export default function ATResultPage() {
  const [results, setResults] = useState<IResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: "", program: "", semester: "", status: "",
  });

  const [detailTarget, setDetailTarget] = useState<IResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IResult | null>(null);

  // Fetch

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllResults();
      setResults(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // Derived

  const filtered = useMemo(() => results.filter((r) => {
    const name = getStudentName(r.student)?.toLowerCase() ?? "";
    if (filters.search   && !name.includes(filters.search.toLowerCase())) return false;
    if (filters.program  && r.program !== filters.program)                 return false;
    if (filters.semester && String(r.semester) !== filters.semester)       return false;
    if (filters.status   && r.overallStatus?.toLowerCase() !== filters.status) return false;
    return true;
  }), [results, filters]);

  const total   = results.length;
  const passed  = results.filter((r) => r.overallStatus?.toLowerCase() === "pass").length;
  const failed  = results.filter((r) => r.overallStatus?.toLowerCase() === "fail").length;
  const avgCgpa = total
    ? (results.reduce((s, r) => s + (r.cgpa ?? 0), 0) / total).toFixed(2)
    : "—";

  // Handlers

  const handleEdit = (r: IResult) => { setEditTarget(r); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await deleteResult(id);
      setResults((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  };

  const handleModalClose = () => { setModalOpen(false); setEditTarget(null); };
  const handleSuccess    = () => { handleModalClose(); fetchResults(); };

  // Render

  return (
    <div className="min-h-screen bg-[#070412] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 text-[#c8b8f0]">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,40,200,0.08),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(120,40,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,40,200,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-900/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400">
                AT Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Results Overview</h1>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-150 hover:-translate-y-px cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-violet-900/40"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Result
          </button>
        </header>

        {/* Stats */}
        {!loading && !error && (
          <StatCards total={total} passed={passed} failed={failed} avgCgpa={avgCgpa} />
        )}

        {/* Filters */}
        <ResultFilters filters={filters} onChange={setFilters} />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {!loading && (
            <div className="px-5 py-3 border-b border-[#1e1535]">
              <span className="text-xs text-[#4a3570]">
                Showing{" "}
                <span className="text-violet-400 font-semibold">{filtered.length}</span> of{" "}
                <span className="text-violet-400 font-semibold">{total}</span> results
              </span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-40" />
                <col className="w-28" />
                <col />
                <col className="w-24" />
                <col className="w-20" />
                <col className="w-24" />
                <col className="w-28" />
              </colgroup>
              <thead>
                <tr className="bg-[#080614]/60 border-b border-[#1e1535]">
                  {["#", "Student", "Class", "Program", "Semester", "CGPA", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[#4a3570]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} i={i} />)}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-[#3a2560]">
                      <div className="flex flex-col items-center gap-2">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-sm">
                          {filters.search || filters.program || filters.semester || filters.status
                            ? "No results match your filters."
                            : "No results found."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filtered.map((r, i) => {
                  const { badge, dot } = statusStyle(r.overallStatus);
                  return (
                    <tr key={r._id}
                      className="border-b border-[#130f22]/60 last:border-0 hover:bg-violet-500/5 transition-colors duration-100">
                      <td className="px-5 py-4 text-xs text-[#3a2560]">{i + 1}</td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDetailTarget(r)}
                          className="font-semibold text-[#e8d8ff] hover:text-violet-300 transition-colors cursor-pointer text-left truncate max-w-[140px] block"
                          title={getStudentName(r.student)}
                        >
                          {getStudentName(r.student)}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-[#6a5590] truncate" title={getClassName(r.class)}>
                        {getClassName(r.class)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-md px-2 py-0.5 text-xs font-medium">
                          {r.program}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#6a5590] text-center">{r.semester}</td>

                      <td className="px-5 py-4 font-bold text-fuchsia-400 tabular-nums">
                        {r.cgpa?.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                          {r.overallStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* View */}
                          <button onClick={() => setDetailTarget(r)} title="View detail"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:scale-105 transition-all cursor-pointer">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {/* Edit */}
                          <button onClick={() => handleEdit(r)} title="Edit"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/20 hover:scale-105 transition-all cursor-pointer">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button onClick={() => handleDelete(r._id)} title="Delete"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all cursor-pointer">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {detailTarget && <DetailModal result={detailTarget} onClose={() => setDetailTarget(null)} />}
      {modalOpen && (
        <ResultModal
          editTarget={editTarget}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}