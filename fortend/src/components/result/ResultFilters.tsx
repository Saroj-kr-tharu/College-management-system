import Chip from "./Chip";

const PROGRAMS = ["BCA", "BE-IT", "BE-CMP", "BE-CIVIL"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export interface FilterState {
  search: string;
  program: string;
  semester: string;
  status: string;
}

interface ResultFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const selectClass =
  "bg-[#0d0818] border border-[#2a1f4a] rounded-xl px-3 py-2.5 text-sm text-[#c8b8f0] outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer appearance-none";

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a3570] pointer-events-none">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function ResultFilters({ filters, onChange }: ResultFiltersProps) {
  const set = (key: keyof FilterState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => onChange({ ...filters, [key]: e.target.value });

  const clear = (key: keyof FilterState) =>
    onChange({ ...filters, [key]: "" });

  const clearAll = () =>
    onChange({ search: "", program: "", semester: "", status: "" });

  const hasFilters = filters.search || filters.program || filters.semester || filters.status;

  return (
    <div className="bg-[#0d0818]/80 border border-[#2a1f4a] rounded-2xl px-5 py-4 mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Search */}
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a3570]">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={filters.search}
            onChange={set("search")}
            placeholder="Search student..."
            className="w-full bg-[#0d0818] border border-[#2a1f4a] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-[#c8b8f0] placeholder-[#2a1f4a] outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>

        {/* Program */}
        <div className="relative">
          <select value={filters.program} onChange={set("program")} className={`${selectClass} w-full pr-8`}>
            <option value="">All Programs</option>
            {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Semester */}
        <div className="relative">
          <select value={filters.semester} onChange={set("semester")} className={`${selectClass} w-full pr-8`}>
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <ChevronDown />
        </div>

        {/* Status */}
        <div className="relative">
          <select value={filters.status} onChange={set("status")} className={`${selectClass} w-full pr-8`}>
            <option value="">All Statuses</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
          <ChevronDown />
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px] text-[#4a3570] uppercase tracking-wider">Filters:</span>
          {filters.search   && <Chip label={`"${filters.search}"`}    onRemove={() => clear("search")} />}
          {filters.program  && <Chip label={filters.program}          onRemove={() => clear("program")} />}
          {filters.semester && <Chip label={`Sem ${filters.semester}`} onRemove={() => clear("semester")} />}
          {filters.status   && <Chip label={filters.status}           onRemove={() => clear("status")} />}
          <button
            onClick={clearAll}
            className="text-[11px] text-violet-400/60 hover:text-violet-400 transition-colors cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}