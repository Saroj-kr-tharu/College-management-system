import { useState, useEffect } from "react";
import type { IResult, IMarkInput } from "../../types/result.types";
import { postResult, updateResult } from "../../api/result.api";
import { getAllClassesList, getStuOnClass } from "../../api/class.api";
import { getAllCoursesList } from "../../api/course.api";

interface Props {
  editTarget: IResult | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface IOption {
  _id: string;
  name?: string;
  title?: string;
  fullName?: string;
  code?: string;
  program?: string;
  semester?: number;
  [key: string]: any;
}

const EXAM_TYPES = ["REGULAR", "BACK"];
const PROGRAMS = ["BCA", "BE-IT", "BE-CMP", "BE-CIVIL"];
const currentYear = new Date().getFullYear();
const EXAM_YEARS = Array.from(
  { length: currentYear + 1 - 2000 + 1 },
  (_, i) => 2000 + i
).reverse();

const emptyMark = (): IMarkInput => ({
  course: "",
  examYear: new Date().getFullYear(),
  examType: "REGULAR",
  mark: 0,
  isAbsent: false,
});

interface IResultForm {
  student: string;
  class: string;
  program: string;
  semester: number;
  marks: IMarkInput[];
}

const emptyForm = (): IResultForm => ({
  student: "",
  class: "",
  program: "",
  semester: 1,
  marks: [emptyMark()],
});

const inputClass =
  "w-full bg-[#080e1c] border border-[#1a2540] rounded-xl px-3.5 py-2.5 text-sm text-[#e8eaf0] placeholder-[#2d3650] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-150";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-[#4a5578]";

export default function ResultModal({ editTarget, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<IResultForm>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown data
  const [students, setStudents] = useState<IOption[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [classes, setClasses] = useState<IOption[]>([]);
  const [allCourses, setAllCourses] = useState<IOption[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<IOption[]>([]);
  const [refLoading, setRefLoading] = useState(true);

  // Fetch classes and all courses on mount
  useEffect(() => {
    const fetchRefs = async () => {
      try {
        setRefLoading(true);
        const [clsRes, crsRes] = await Promise.all([
          getAllClassesList(),
          getAllCoursesList(),
        ]);
        setClasses(clsRes.data || []);
        setAllCourses(crsRes.data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load form data.");
      } finally {
        setRefLoading(false);
      }
    };
    fetchRefs();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editTarget) {
      const program = editTarget.program;
      const semester = editTarget.semester;

      setForm({
        student:
          typeof editTarget.student === "object"
            ? editTarget.student._id
            : editTarget.student,
        class:
          typeof editTarget.class === "object"
            ? editTarget.class._id
            : editTarget.class,
        program,
        semester,
        marks:
          editTarget.marks?.map((m) => ({
            course:
              typeof m.course === "object" ? m.course._id : m.course,
            examYear: m.examYear,
            examType: m.examType,
            mark: m.mark,
            isAbsent: m.isAbsent ?? false,
          })) ?? [emptyMark()],
      });

      // Fetch students for the existing class
      const classId =
        typeof editTarget.class === "object"
          ? editTarget.class._id
          : editTarget.class;
      if (classId) fetchStudentsByClass(classId);

      // Filter courses for existing program + semester
      if (program && semester) {
        filterCourses(program, semester);
      }
    } else {
      setForm(emptyForm());
      setStudents([]);
      setFilteredCourses([]);
    }
  }, [editTarget, allCourses]);

  // Helper: fetch students by class
  const fetchStudentsByClass = async (classId: string) => {
    try {
      setStudentsLoading(true);
      setStudents([]);
      const res = await getStuOnClass(classId, 1, 1000); // page 1, large perPage to get all
      // Response shape depends on your API — check what res looks like:
      setStudents(res.data?.data || res.data || []);
    } catch {
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Helper: filter courses by program + semester
  const filterCourses = (program: string, semester: number) => {
    if (!program || !semester) {
      setFilteredCourses([]);
      return;
    }
    const filtered = allCourses.filter(
      (c) => c.program === program && c.semester === semester
    );
    setFilteredCourses(filtered);
  };

  // Top-level field change
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsed = type === "number" ? Number(value) : value;

    setForm((prev) => ({ ...prev, [name]: parsed }));

    // When class changes → fetch students for that class
    if (name === "class") {
      if (value) {
        await fetchStudentsByClass(value);
      } else {
        setStudents([]);
      }
      // Reset student selection when class changes
      setForm((prev) => ({ ...prev, class: value, student: "" }));
      return;
    }

    // When program or semester changes → filter courses
    if (name === "program" || name === "semester") {
      const newProgram = name === "program" ? value : form.program;
      const newSemester =
        name === "semester" ? Number(value) : form.semester;
      filterCourses(newProgram, newSemester);

      // Reset all course selections in marks when program/semester changes
      setForm((prev) => ({
        ...prev,
        [name]: parsed,
        marks: prev.marks.map((m) => ({ ...m, course: "" })),
      }));
      return;
    }
  };

  // Per-mark field change
  const handleMarkChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => {
      const updated = [...prev.marks];
      let parsedVal: any =
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value;
      if (name === "mark" && type === "number") {
        parsedVal = Math.min(100, Math.max(0, parsedVal));
      }
      updated[index] = { ...updated[index], [name]: parsedVal };
      return { ...prev, marks: updated };
    });
  };

  const addMark = () =>
    setForm((prev) => ({ ...prev, marks: [...prev.marks, emptyMark()] }));

  const removeMark = (index: number) =>
    setForm((prev) => ({
      ...prev,
      marks: prev.marks.filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    setError(null);

    if (!form.student) return setError("Please select a student.");
    if (!form.class) return setError("Please select a class.");
    if (!form.program) return setError("Please select a program.");
    if (form.semester < 1 || form.semester > 8)
      return setError("Semester must be between 1 and 8.");
    if (!form.marks.length) return setError("Add at least one course mark.");

    for (const [i, m] of form.marks.entries()) {
      if (!m.course) return setError(`Mark #${i + 1}: Please select a course.`);
      if (!m.examYear) return setError(`Mark #${i + 1}: Exam year is required.`);
      if (!m.examType) return setError(`Mark #${i + 1}: Exam type is required.`);
      if (m.mark === undefined || m.mark === null)
        return setError(`Mark #${i + 1}: Mark value is required.`);
      if (m.mark < 0 || m.mark > 100)
        return setError(`Mark #${i + 1}: Mark must be between 0 and 100.`);
    }

    try {
      setLoading(true);
      if (editTarget) {
        await updateResult(editTarget._id, {
          student: form.student as any,
          class: form.class as any,
          program: form.program,
          semester: form.semester,
        });
      } else {
        await postResult(form);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (item: IOption) =>
    item.fullName || item.name || item.title || item._id;

  const getCourseLabel = (c: IOption) =>
    c.code
      ? `${c.name ?? c.title} (${c.code})`
      : c.name ?? c.title ?? c._id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-[fadeIn_0.15s_ease] px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-gradient-to-b from-[#0f1829] to-[#0b1120] border border-[#1e2d4a] sm:rounded-2xl rounded-t-2xl overflow-hidden animate-[slideUp_0.2s_ease] shadow-2xl shadow-black/60">

        {/* Top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-7 pt-5 sm:pt-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-1">
              {editTarget ? "Editing Record" : "New Record"}
            </p>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {editTarget ? "Update Result" : "Add Result"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-[#1e2740] text-indigo-400 hover:bg-indigo-500/15 transition-colors duration-150 cursor-pointer flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 space-y-6">

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {refLoading ? (
            <div className="flex items-center justify-center py-10 gap-3 text-[#4a5578] text-sm">
              <span className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
              Loading form data...
            </div>
          ) : (
            <>
              {/* ── Result-level fields ── */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#3d4f72] mb-3">
                  Result Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Class — must pick first */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Class</label>
                    <select
                      name="class"
                      value={form.class}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select class</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>{getLabel(c)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Student — depends on class */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Student
                      {!form.class && (
                        <span className="ml-1.5 normal-case font-normal tracking-normal text-[#3a4060]">
                          — select class first
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        name="student"
                        value={form.student}
                        onChange={handleChange}
                        disabled={!form.class || studentsLoading}
                        className={`${inputClass} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        <option value="">
                          {studentsLoading ? "Loading..." : "Select student"}
                        </option>
                        {students.map((s) => (
                          <option key={s._id} value={s._id}>{getLabel(s)}</option>
                        ))}
                      </select>
                      {studentsLoading && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin pointer-events-none" />
                      )}
                    </div>
                    {form.class && !studentsLoading && students.length === 0 && (
                      <p className="text-[11px] text-amber-400/70">No students found in this class.</p>
                    )}
                  </div>

                  {/* Program */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Program</label>
                    <select
                      name="program"
                      value={form.program}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select program</option>
                      {PROGRAMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Semester{" "}
                      <span className="normal-case font-normal tracking-normal text-[#3a4060]">
                        (1–8)
                      </span>
                    </label>
                    <input
                      name="semester"
                      type="number"
                      min={1}
                      max={8}
                      value={form.semester}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Course availability hint */}
                  {form.program && form.semester && filteredCourses.length === 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-[11px] text-amber-400/70 bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2">
                        No courses found for <strong>{form.program}</strong> — Semester <strong>{form.semester}</strong>.
                      </p>
                    </div>
                  )}
                  {form.program && form.semester && filteredCourses.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-[11px] text-indigo-400/60">
                        {filteredCourses.length} course{filteredCourses.length > 1 ? "s" : ""} available for {form.program} — Semester {form.semester}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* ── Marks section ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#3d4f72]">
                    Course Marks
                    <span className="ml-1.5 normal-case font-normal tracking-normal text-[#3a4060]">
                      — CGPA &amp; status are auto-calculated
                    </span>
                  </p>
                  <button
                    onClick={addMark}
                    type="button"
                    disabled={!form.program || filteredCourses.length === 0}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Course
                  </button>
                </div>

                <div className="space-y-3">
                  {form.marks.map((m, i) => (
                    <div
                      key={i}
                      className="bg-[#080e1c]/60 border border-[#1a2540] rounded-xl p-4 space-y-3"
                    >
                      {/* Mark header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4a5578]">
                          Course #{i + 1}
                        </span>
                        {form.marks.length > 1 && (
                          <button
                            onClick={() => removeMark(i)}
                            type="button"
                            className="text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove this course"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Course — filtered by program + semester */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className={labelClass}>
                            Course
                            {!form.program && (
                              <span className="ml-1.5 normal-case font-normal tracking-normal text-[#3a4060]">
                                — select program &amp; semester first
                              </span>
                            )}
                          </label>
                          <select
                            name="course"
                            value={m.course}
                            onChange={(e) => handleMarkChange(i, e)}
                            disabled={filteredCourses.length === 0}
                            className={`${inputClass} cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            <option value="">
                              {filteredCourses.length === 0
                                ? "No courses available"
                                : "Select course"}
                            </option>
                            {filteredCourses.map((c) => (
                              <option key={c._id} value={c._id}>
                                {getCourseLabel(c)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Exam Year */}
                        <div className="flex flex-col gap-1.5">
                          <label className={labelClass}>Exam Year</label>
                          <select
                            name="examYear"
                            value={m.examYear}
                            onChange={(e) => handleMarkChange(i, e)}
                            className={`${inputClass} cursor-pointer`}
                          >
                            {EXAM_YEARS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>

                        {/* Exam Type */}
                        <div className="flex flex-col gap-1.5">
                          <label className={labelClass}>Exam Type</label>
                          <select
                            name="examType"
                            value={m.examType}
                            onChange={(e) => handleMarkChange(i, e)}
                            className={`${inputClass} cursor-pointer`}
                          >
                            {EXAM_TYPES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        {/* Mark */}
                        <div className="flex flex-col gap-1.5">
                          <label className={labelClass}>
                            Mark{" "}
                            <span className="normal-case font-normal tracking-normal text-[#3a4060]">
                              (0–100)
                            </span>
                          </label>
                          <input
                            name="mark"
                            type="number"
                            min={0}
                            max={100}
                            value={m.mark}
                            onChange={(e) => handleMarkChange(i, e)}
                            disabled={m.isAbsent}
                            className={`${inputClass} disabled:opacity-40`}
                          />
                        </div>

                        {/* Is Absent */}
                        <div className="flex items-center gap-2.5 self-end pb-2.5">
                          <input
                            id={`absent-${i}`}
                            name="isAbsent"
                            type="checkbox"
                            checked={m.isAbsent}
                            onChange={(e) => handleMarkChange(i, e)}
                            className="w-4 h-4 accent-indigo-500 cursor-pointer"
                          />
                          <label
                            htmlFor={`absent-${i}`}
                            className={`${labelClass} cursor-pointer normal-case tracking-normal font-medium text-[#8896b3]`}
                          >
                            Absent
                          </label>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit note */}
              {editTarget && (
                <p className="text-[11px] text-[#3a4060] bg-[#080e1c]/60 border border-[#1a2540] rounded-xl px-4 py-3">
                  Note: editing only updates Student, Class, Program, and Semester. To change marks, please delete and recreate the result.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-7 py-4 sm:py-5 border-t border-[#1a2540] bg-[#080e1c]/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-[#1e2740] text-indigo-400 text-sm font-semibold hover:bg-indigo-500/10 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || refLoading}
            className="min-w-[130px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 hover:-translate-y-px transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editTarget ? (
              "Save Changes"
            ) : (
              "Create Result"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}