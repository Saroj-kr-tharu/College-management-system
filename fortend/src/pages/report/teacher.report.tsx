import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Cell,
} from "recharts";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiGrid,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";

// Types
interface Course {
  _id: string;
  code: string;
  name: string;
  creditHours: number;
  department: string;
  semester: number;
  program: string;
  isActive: boolean;
  createdAt: string;
}

interface ClassInfo {
  _id: string;
  name: string;
  program: string;
  semester: number;
  students: string[];
  courses: string[];
  teacher: string;
  isActive: boolean;
  createdAt: string;
}

interface TeacherInfo {
  profile: { path: string; public_id: string };
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  courses: Course[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherReportData {
  role: string;
  teacherInfo: TeacherInfo;
  classInfo: ClassInfo[];
  totalStudentCount: number;
  percentage: number;
}

// Palette
const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

// Sub-components
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-4 group bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
    <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10 ${accent}`} />
  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className="text-indigo-400 text-lg" />
    <h2 className="text-base font-bold text-gray-200 uppercase tracking-wider">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-indigo-600/30 to-transparent ml-2" />
  </div>
);

// Custom Tooltip
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.fill }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function TeacherReport({ data }: { data: TeacherReportData }) {
  if (!data) return null;

  const { teacherInfo, classInfo, totalStudentCount, percentage } = data;

  const totalCreditHours = teacherInfo.courses.reduce((sum, c) => sum + c.creditHours, 0);

  // Round percentage to 2 decimals
  const roundedPercentage = parseFloat(percentage.toFixed(2));

  const creditHoursData = teacherInfo.courses.map((c) => ({
    name: c.code,
    credits: c.creditHours,
    semester: c.semester,
    fullName: c.name,
  }));

  // Correct student & course counts
  const classStudentData = classInfo.map((cls) => ({
    name: cls.name,
    students: Array.isArray(cls.students) ? cls.students.length : 0,
    courses: Array.isArray(cls.courses) ? cls.courses.length : 0,
    semester: cls.semester,
  }));

  const radialData = [{ name: "Completion", value: roundedPercentage, fill: "#6366f1" }];

  const joinDate = new Date(teacherInfo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-800 via-indigo-700 to-violet-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10 animate-pulse-slow">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-800 rounded-full translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={teacherInfo.profile.path}
              alt={teacherInfo.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  teacherInfo.fullName
                )}&background=6366f1&color=fff&size=128`;
              }}
            />
            {teacherInfo.isActive && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-gray-900 rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                {teacherInfo.fullName}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                <HiAcademicCap className="text-sm" />
                {data.role}
              </span>
            </div>
            <p className="text-indigo-200 text-sm mb-3">
              Department of {teacherInfo.department} · Joined {joinDate}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-indigo-100">
              <span className="flex items-center gap-1">
                <FiMail /> {teacherInfo.email}
              </span>
              <span className="flex items-center gap-1">
                <FiPhone /> {teacherInfo.phone}
              </span>
              <span className="flex items-center gap-1">
                <FiUser /> {teacherInfo.gender}
              </span>
            </div>
          </div>

          {/* Radial */}
          <div className="shrink-0 hidden lg:flex flex-col items-center">
            <RadialBarChart width={120} height={120} cx={60} cy={60} innerRadius={32} outerRadius={50} data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.1)" }} />
            </RadialBarChart>
            <p className="text-white font-extrabold text-xl -mt-16">{roundedPercentage}%</p>
            <p className="text-indigo-200 text-xs mt-8">Progress</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={FiUsers} label="Total Students" value={totalStudentCount} accent="bg-indigo-500" />
          <StatCard icon={FiGrid} label="Classes" value={classInfo.length} accent="bg-cyan-500" />
          <StatCard icon={FiBookOpen} label="Courses" value={teacherInfo.courses.length} accent="bg-amber-500" />
          <StatCard icon={FiAward} label="Credit Hours" value={totalCreditHours} accent="bg-emerald-500" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Hours */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
            <SectionTitle icon={FiBookOpen} title="Credit Hours per Course" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={creditHoursData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="credits" name="Credits" radius={[8, 8, 0, 0]}>
                  {creditHoursData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Students & Courses per Class */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700">
            <SectionTitle icon={FiUsers} title="Students & Courses per Class" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={classStudentData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
                <Bar dataKey="students" name="Students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="courses" name="Courses" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-700 overflow-x-auto">
          <SectionTitle icon={FiBookOpen} title="Assigned Courses" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {["Code", "Course Name", "Department", "Program", "Semester", "Credits", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {teacherInfo.courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-mono font-semibold text-xs">
                      {course.code}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-200 whitespace-nowrap">{course.name}</td>
                  <td className="py-3 pr-4 text-gray-400">{course.department}</td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-700 text-cyan-100 text-xs font-medium">
                      {course.program}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center text-gray-300">{course.semester}</td>
                  <td className="py-3 pr-4 text-center">
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                      <FiClock className="text-amber-500" />
                      {course.creditHours}
                    </span>
                  </td>
                  <td className="py-3">
                    {course.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                        <FiCheckCircle /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherReport;