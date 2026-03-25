import type { IResult } from "../../types/result.types";

interface DetailModalProps {
  result: IResult;
  onClose: () => void;
}

const getStudentName = (student: IResult["student"]) =>
  typeof student === "object" ? student.fullName : student;

const getClassName = (cls: IResult["class"]) =>
  typeof cls === "object" ? cls.name : cls;

const statusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pass": return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
    case "fail": return "bg-red-500/15 text-red-400 border border-red-500/25";
    default:     return "bg-slate-500/15 text-slate-400 border border-slate-500/25";
  }
};

const gradeColor = (grade: string) => {
  switch (grade?.toUpperCase()) {
    case "A+": case "A":  return "text-emerald-400";
    case "B+": case "B":  return "text-violet-400";
    case "C+": case "C":  return "text-amber-400";
    case "D":             return "text-orange-400";
    case "F":             return "text-red-400";
    default:              return "text-slate-400";
  }
};

export default function DetailModal({ result, onClose }: DetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] flex flex-col bg-[#0d0818] border border-[#2a1f4a] rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
        style={{ animation: "popIn 0.18s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Header accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#1e1535]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-1">Result Detail</p>
            <h2 className="text-lg font-bold text-white">{getStudentName(result.student)}</h2>
            <p className="text-sm text-[#6a5590] mt-0.5">
              {result.program} · Semester {result.semester} · {getClassName(result.class)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-violet-400 tabular-nums">{result.cgpa?.toFixed(2)}</p>
              <p className="text-[10px] text-[#4a3570] uppercase tracking-wider">CGPA</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-[#2a1f4a] text-violet-400 hover:bg-violet-500/15 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Marks table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!result.marks?.length ? (
            <p className="text-center text-[#3a2560] text-sm py-8">No marks available.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1e1535]">
                  {["#", "Course", "Year", "Type", "Mark", "Grade", "Status"].map((h) => (
                    <th key={h} className="pb-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#4a3570] first:w-8">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.marks.map((m, i) => {
                  const courseName = typeof m.course === "object"
                    ? `${m.course.name} (${m.course.code})`
                    : m.course;
                  const isPassing = !m.isAbsent && m.grade !== "F";

                  return (
                    <tr key={m._id} className="border-b border-[#130f22]/60 last:border-0 hover:bg-violet-500/5 transition-colors">
                      <td className="py-3 text-xs text-[#3a2560]">{i + 1}</td>
                      <td className="py-3 text-[#c8b8f0] font-medium pr-4 max-w-[180px] truncate" title={courseName}>
                        {courseName}
                      </td>
                      <td className="py-3 text-[#6a5590] text-xs">{m.examYear}</td>
                      <td className="py-3">
                        <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded px-1.5 py-0.5 text-xs">
                          {m.examType}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-white tabular-nums">
                        {m.isAbsent
                          ? <span className="text-amber-400/70 text-xs font-normal italic">Absent</span>
                          : m.mark}
                      </td>
                      <td className={`py-3 font-bold tabular-nums ${gradeColor(m.grade)}`}>
                        {m.isAbsent ? "—" : m.grade}
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          m.isAbsent
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : isPassing
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : "bg-red-500/10 text-red-400 border border-red-500/25"
                        }`}>
                          {m.isAbsent ? "Absent" : isPassing ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#1e1535] px-6 py-3 flex items-center justify-between bg-[#080614]/50">
          <span className="text-xs text-[#4a3570]">{result.marks?.length ?? 0} courses</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusBadge(result.overallStatus)}`}>
            {result.overallStatus}
          </span>
        </div>
      </div>

      <style>{`@keyframes popIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
}