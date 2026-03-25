import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { getClassReport } from "../../api/result.api";
import { getAllClassesList } from "../../api/class.api";

// Types

interface IClassInfo {
  _id: string;
  name: string;
  program: string;
  semester: number;
}

interface IMark {
  _id: string;
  course: { _id: string; name: string; code: string } | string;
  examYear: number;
  examType: string;
  mark: number;
  grade: string;
  isAbsent: boolean;
}

interface IResultRow {
  _id: string;
  student: { _id: string; fullName: string; email: string; rollNumber: string } | string;
  program: string;
  semester: number;
  cgpa: number;
  overallStatus: string;
  marks: IMark[];
}

interface IClassReportData {
  classInfo: IClassInfo;
  totalStudents: number;
  totalPass: number;
  totalFail: number;
  passPercentage: number;
  failPercentage: number;
  avgCgpa: number;
  results: IResultRow[];
}

interface IClassOption {
  _id: string;
  name: string;
  program: string;
  semester: number;
}

// Helpers

const getStudentName = (s: IResultRow["student"]) =>
  typeof s === "object" ? s.fullName : s;

const getRollNumber = (s: IResultRow["student"]) =>
  typeof s === "object" ? s.rollNumber : "—";

const statusStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PASS": return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
    case "FAIL": return "bg-red-500/15 text-red-400 border border-red-500/25";
    default:     return "bg-slate-500/15 text-slate-400 border border-slate-500/25";
  }
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const PIE_COLORS = ["#10b981", "#f43f5e"];

// Stat Card

const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl px-5 py-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
    <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
    <p className="text-[11px] text-[#4a3570] uppercase tracking-wider mt-1 font-medium">{label}</p>
  </div>
);

// Custom Tooltip

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0d0818] border border-[#2a1f4a] text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.fill || p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Page

export default function ClassReportPage() {
  const [classes, setClasses] = useState<IClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [report, setReport] = useState<IClassReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Fetch class list on mount
  useEffect(() => {
    getAllClassesList()
      .then((res) => setClasses(res.data || []))
      .catch((err) => console.error("Class fetch failed:", err));
  }, []);

  const fetchReport = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      setError(null);
      setReport(null);
      const res = await getClassReport(selectedClass, selectedSemester || undefined);
      setReport(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const pieData = report
    ? [
        { name: "Pass", value: report.totalPass },
        { name: "Fail", value: report.totalFail },
      ]
    : [];

  const cgpaBarData = report?.results.map((r) => ({
    name: getStudentName(r.student),
    cgpa: r.cgpa,
    status: r.overallStatus,
  })) ?? [];

  const selectCls =
    "bg-[#0d0818] border border-[#2a1f4a] rounded-xl px-3 py-2.5 text-sm text-[#c8b8f0] outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer appearance-none";

  return (
    <div className="min-h-screen bg-[#070412] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 text-[#c8b8f0]">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,40,200,0.08),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(120,40,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,40,200,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400">Reports</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Class Report</h1>
        </header>

        {/* Filter Bar */}
        <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl px-5 py-4 mb-7">
          <div className="flex flex-col sm:flex-row gap-3 items-end">

            {/* Class selector */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4a3570]">Select Class</label>
              <div className="relative">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className={`${selectCls} w-full pr-8`}>
                  <option value="">Choose a class...</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} — {c.program}</option>
                  ))}
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a3570] pointer-events-none">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Semester filter */}
            <div className="w-full sm:w-44 flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4a3570]">Semester</label>
              <div className="relative">
                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className={`${selectCls} w-full pr-8`}>
                  <option value="">All Semesters</option>
                  {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a3570] pointer-events-none">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={fetchReport}
              disabled={!selectedClass || loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px cursor-pointer shadow-lg shadow-violet-900/40"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              )}
              Generate
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !report && !error && (
          <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl flex flex-col items-center justify-center py-20 gap-3 text-[#3a2560]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm">Select a class and click Generate to view the report.</p>
          </div>
        )}

        {/* Report Content */}
        {report && (
          <div className="space-y-6">

            {/* Class info banner */}
            <div className="bg-gradient-to-r from-violet-600/10 to-fuchsia-600/5 border border-[#2a1f4a] rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="text-[11px] text-violet-400 font-semibold uppercase tracking-widest mb-1">Class Report</p>
                <h2 className="text-xl font-bold text-white">{report.classInfo.name}</h2>
                <p className="text-sm text-[#6a5590] mt-0.5">{report.classInfo.program}</p>
              </div>
              <div className="h-0.5 sm:h-auto sm:w-px bg-[#2a1f4a] self-stretch hidden sm:block" />
              <div className="text-right">
                <p className="text-2xl font-bold text-fuchsia-400 tabular-nums">{report.avgCgpa.toFixed(2)}</p>
                <p className="text-[11px] text-[#4a3570] uppercase tracking-wider">Avg CGPA</p>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Students" value={report.totalStudents} color="text-violet-400" />
              <StatCard label="Passed"         value={report.totalPass}     color="text-emerald-400" />
              <StatCard label="Failed"         value={report.totalFail}     color="text-red-400" />
              <StatCard label="Pass Rate"      value={`${report.passPercentage}%`} color="text-fuchsia-400" />
            </div>

            {/* Charts */}
            {report.totalStudents > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Pie — pass/fail */}
                <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4a3570] mb-4">Pass / Fail Ratio</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} innerRadius={45}
                        dataKey="value" paddingAngle={4}
                        label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0d0818", border: "1px solid #2a1f4a", borderRadius: "12px", fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar — CGPA per student */}
                <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4a3570] mb-4">CGPA per Student</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={cgpaBarData} barCategoryGap="35%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1535" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6a5590" }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => v.split(" ")[0]} />
                      <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: "#6a5590" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.05)" }} />
                      <Bar dataKey="cgpa" name="CGPA" radius={[6, 6, 0, 0]}>
                        {cgpaBarData.map((entry, i) => (
                          <Cell key={i} fill={entry.status?.toUpperCase() === "PASS" ? "#10b981" : "#f43f5e"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Results table */}
            <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="px-5 py-3 border-b border-[#1e1535]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4a3570]">
                  Student Results — {report.results.length} record{report.results.length !== 1 ? "s" : ""}
                </p>
              </div>

              {report.results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-[#3a2560] gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm">No results found for this filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#080614]/60 border-b border-[#1e1535]">
                        {["#", "Student", "Roll No.", "Program", "Semester", "CGPA", "Status", "Marks"].map((h) => (
                          <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-[#4a3570]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.results.map((r, i) => (
                        <>
                          <tr key={r._id}
                            className="border-b border-[#130f22]/60 last:border-0 hover:bg-violet-500/5 transition-colors cursor-pointer"
                            onClick={() => setExpandedRow(expandedRow === r._id ? null : r._id)}
                          >
                            <td className="px-5 py-3.5 text-xs text-[#3a2560]">{i + 1}</td>
                            <td className="px-5 py-3.5 font-semibold text-[#e8d8ff]">{getStudentName(r.student)}</td>
                            <td className="px-5 py-3.5 text-[#6a5590] text-xs font-mono">{getRollNumber(r.student)}</td>
                            <td className="px-5 py-3.5">
                              <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-md px-2 py-0.5 text-xs font-medium">
                                {r.program}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-[#6a5590] text-center">{r.semester}</td>
                            <td className="px-5 py-3.5 font-bold text-fuchsia-400 tabular-nums">{r.cgpa?.toFixed(2)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(r.overallStatus)}`}>
                                {r.overallStatus}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                className={`text-violet-500/50 transition-transform duration-200 ${expandedRow === r._id ? "rotate-180" : ""}`}>
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </td>
                          </tr>

                          {/* Expanded marks row */}
                          {expandedRow === r._id && (
                            <tr key={`${r._id}-detail`} className="border-b border-[#130f22]/60">
                              <td colSpan={8} className="px-6 py-4 bg-[#080614]/40">
                                {!r.marks?.length ? (
                                  <p className="text-xs text-[#3a2560]">No marks available.</p>
                                ) : (
                                  <table className="w-full text-xs border-collapse">
                                    <thead>
                                      <tr className="border-b border-[#1e1535]">
                                        {["Course", "Year", "Type", "Mark", "Grade", "Status"].map((h) => (
                                          <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-widest text-[#4a3570]">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {r.marks.map((m) => {
                                        const cName = typeof m.course === "object" ? `${m.course.name} (${m.course.code})` : m.course;
                                        const pass = !m.isAbsent && m.grade !== "F";
                                        return (
                                          <tr key={m._id} className="border-b border-[#0f1a2e]/60 last:border-0">
                                            <td className="py-2 text-[#c8b8f0] pr-4">{cName}</td>
                                            <td className="py-2 text-[#6a5590]">{m.examYear}</td>
                                            <td className="py-2">
                                              <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded px-1.5 py-0.5 text-[10px]">{m.examType}</span>
                                            </td>
                                            <td className="py-2 font-bold text-white tabular-nums">
                                              {m.isAbsent ? <span className="text-amber-400/70 italic font-normal">Absent</span> : m.mark}
                                            </td>
                                            <td className={`py-2 font-bold tabular-nums ${m.grade === "F" ? "text-red-400" : m.grade?.startsWith("A") ? "text-emerald-400" : "text-violet-400"}`}>
                                              {m.isAbsent ? "—" : m.grade}
                                            </td>
                                            <td className="py-2">
                                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                m.isAbsent ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                                                : pass ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                                                : "bg-red-500/10 text-red-400 border border-red-500/25"
                                              }`}>
                                                {m.isAbsent ? "Absent" : pass ? "Pass" : "Fail"}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
