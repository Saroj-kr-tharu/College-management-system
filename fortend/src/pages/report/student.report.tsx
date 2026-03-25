import  { useState } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'

import {
  FiUser, FiMail, FiPhone, FiMapPin, 
  FiCalendar, FiAward, FiTrendingUp, FiCheckCircle,
  FiXCircle, FiGrid, FiAlertTriangle
} from 'react-icons/fi'

import { type ComponentType } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import { MdFingerprint, MdClass } from 'react-icons/md'

// Types
interface Course {
  _id: string
  code: string
  name: string
  department: string
  program: string
  semester: number
  creditHours: number
  isActive: boolean
}

interface ClassItem {
  _id: string
  name: string
  program: string
  semester: number
  students: string[]
  courses: string[]
  isActive: boolean
}

interface StudentInfo {
  fullName: string
  email: string
  phone: string
  address: string
  rollNumber: string
  registrationNumber: string
  gender: string
  dob: string
  program: string
  semester: number
  isActive: boolean
  profile?: { path: string }
  courses: Course[]
  classes: ClassItem[]
}

interface AttendanceRecord {
  _id: string
  date: string
  course: string
  status: 'PRESENT' | 'ABSENT'
//   remarks?: string
}

interface StudentReportData {
  studentInfo: StudentInfo
  attendance: AttendanceRecord[]
  present: number
  absent: number
  total: number
  presentPercent: number
}

// Helpers
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

const COLORS = {
  present: '#22d3a5',
  absent: '#f87171',
  bg: '#0d1117',
  card: '#161b22',
  border: '#21262d',
  accent: '#58a6ff',
  muted: '#8b949e',
  warn: '#f0a500',
}

// Sub-components
function StatCard({ icon: Icon, label, value, color = COLORS.accent }: {
  icon: ComponentType
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: '1.2rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      transition: 'transform .2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 10,
        background: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 20, flexShrink: 0,
      }}>
        <Icon />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>{value}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  const rad = Math.PI / 180
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const x = Number(cx) + r * Math.cos(-Number(midAngle) * rad)
  const y = Number(cy) + r * Math.sin(-Number(midAngle) * rad)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontWeight={600}>
      {`${(Number(percent) * 100).toFixed(0)}%`}
    </text>
  )
}

// Main component
export default function StudentReport({ data: _rawData }: { data: StudentReportData | unknown }) {
  const data = _rawData as StudentReportData
  const [tab, setTab] = useState('overview')

  if (!data) return (
    <div style={{ color: COLORS.muted, padding: '2rem', fontFamily: 'sans-serif' }}>
      No data provided.
    </div>
  )

  const { studentInfo: s, attendance, present, absent, total, presentPercent } = data

  // Derived data
  const pieData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]

  // per-course attendance
  const courseMap: Record<string, { name: string; present: number; absent: number }> = {}
  s.courses.forEach((c: Course) => { courseMap[c._id] = { name: c.code, present: 0, absent: 0 } })
  attendance.forEach((a: AttendanceRecord) => {
    if (courseMap[a.course]) {
      courseMap[a.course][a.status === 'PRESENT' ? 'present' : 'absent']++
    }
  })
  const barData = Object.values(courseMap).map(c => ({
    name: c.name,
    Present: c.present,
    Absent: c.absent,
  }))

  const attendanceColor = presentPercent >= 75 ? COLORS.present : presentPercent >= 50 ? COLORS.warn : COLORS.absent

  // Styles
  const root = {
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    background: COLORS.bg,
    minHeight: '100vh',
    color: '#e6edf3',
    padding: '0 0 3rem',
  }

  const section = {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: '1.5rem',
    marginBottom: '1.5rem',
  }

  const badge = (color: string) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
    background: `${color}20`, color,
  })

  const tabStyle = (active: boolean) => ({
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'all .2s',
    background: active ? COLORS.accent : 'transparent',
    color: active ? '#0d1117' : COLORS.muted,
  })

  return (
    <div style={root}>

      {/* Hero Header */}
      <div style={{
        background: `linear-gradient(135deg, #0f1923 0%, #1a2540 50%, #0d1117 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '2rem 2rem 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circle */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 260, height: 260, borderRadius: '50%',
          background: `${COLORS.accent}08`, border: `1px solid ${COLORS.accent}15`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.muted, fontSize: 12, marginBottom: '1.5rem' }}>
            <HiAcademicCap size={14} />
            <span>Student Report</span>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
            alignItems: 'flex-end', paddingBottom: '1.5rem',
          }}>
            {/* avatar */}
            <div style={{ position: 'relative' }}>
              <img
                src={s.profile?.path}
                alt={s.fullName}
                style={{
                  width: 90, height: 90, borderRadius: 16,
                  border: `3px solid ${COLORS.accent}`,
                  objectFit: 'cover', display: 'block',
                }}
                onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&background=1a2540&color=58a6ff&size=90` }}
              />
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 18, height: 18, borderRadius: '50%',
                background: s.isActive ? COLORS.present : COLORS.absent,
                border: `2px solid ${COLORS.bg}`,
              }} />
            </div>

            {/* info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, letterSpacing: -0.5 }}>
                {s.fullName}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                <span style={badge(COLORS.accent)}><FiGrid size={10} />{s.program}</span>
                <span style={badge(COLORS.warn)}>Semester {s.semester}</span>
                <span style={badge(s.isActive ? COLORS.present : COLORS.absent)}>
                  {s.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: 12, color: COLORS.muted, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiMail size={11} />{s.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiPhone size={11} />{s.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiMapPin size={11} />{s.address}</span>
              </div>
            </div>

            {/* big attendance ring */}
            <div style={{
              textAlign: 'center',
              background: `${attendanceColor}10`,
              border: `1px solid ${attendanceColor}30`,
              borderRadius: 14, padding: '1rem 1.5rem',
            }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: attendanceColor, lineHeight: 1 }}>
                {presentPercent}%
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Attendance</div>
              {presentPercent < 75 && (
                <div style={{ ...badge(COLORS.warn), marginTop: 8 }}>
                  <FiAlertTriangle size={10} /> Below 75%
                </div>
              )}
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 4, borderTop: `1px solid ${COLORS.border}`, paddingTop: '1rem', marginTop: 4 }}>
            {['overview', 'courses', 'attendance'].map(t => (
              <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            {/* stat cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              <StatCard icon={FiCheckCircle} label="Total Present" value={present} color={COLORS.present} />
              <StatCard icon={FiXCircle} label="Total Absent" value={absent} color={COLORS.absent} />
              <StatCard icon={FiCalendar} label="Total Classes" value={total} color={COLORS.accent} />
              <StatCard icon={FiTrendingUp} label="Attendance %" value={`${presentPercent}%`} color={attendanceColor} />
            </div>

            {/* charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

              {/* Pie */}
              <div style={section}>
                <h3 style={{ margin: '0 0 1rem', fontSize: 14, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Attendance Overview
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      labelLine={false}
                      label={CustomPieLabel}
                    >
                      <Cell fill={COLORS.present} />
                      <Cell fill={COLORS.absent} />
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: '#e6edf3' }}
                    />
                    <Legend
                      iconType="circle"
                      formatter={(v) => <span style={{ color: '#e6edf3', fontSize: 12 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar */}
              <div style={section}>
                <h3 style={{ margin: '0 0 1rem', fontSize: 14, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Per-Course Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: '#e6edf3' }}
                      cursor={{ fill: `${COLORS.accent}10` }}
                    />
                    <Legend formatter={(v) => <span style={{ color: '#e6edf3', fontSize: 12 }}>{v}</span>} />
                    <Bar dataKey="Present" fill={COLORS.present} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Absent" fill={COLORS.absent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* student details */}
            <div style={section}>
              <h3 style={{ margin: '0 0 1.2rem', fontSize: 14, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                Student Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { icon: FiAward, label: 'Roll Number', val: s.rollNumber },
                  { icon: MdFingerprint, label: 'Reg. Number', val: s.registrationNumber },
                  { icon: FiUser, label: 'Gender', val: s.gender },
                  { icon: FiCalendar, label: 'Date of Birth', val: fmt(s.dob) },
                  { icon: FiGrid, label: 'Program', val: s.program },
                  { icon: HiAcademicCap, label: 'Semester', val: `Semester ${s.semester}` },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.8rem', background: COLORS.bg, borderRadius: 10,
                  }}>
                    <Icon style={{ color: COLORS.accent, fontSize: 16, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: '#e6edf3' }}>
              Enrolled Courses{' '}
              <span style={{ color: COLORS.muted, fontSize: 13, fontWeight: 400 }}>
                ({s.courses?.length ?? 0})
              </span>
            </h2>
        
            {s.courses && s.courses.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {s.courses.map((c: Course) => (
                  <div
                    key={c._id}
                    style={{
                      ...section,
                      marginBottom: 0,
                      borderTop: `3px solid ${COLORS.accent}`,
                      transition: 'transform .2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ ...badge(COLORS.accent), marginBottom: 8 }}>{c.code}</div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{c.name}</h3>
                      </div>
                      <span style={badge(c.isActive ? COLORS.present : COLORS.absent)}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                      {[
                        ['Department', c.department],
                        ['Program', c.program],
                        ['Semester', `Sem ${c.semester}`],
                        ['Credit Hours', `${c.creditHours} hrs`],
                      ].map(([lbl, val]) => (
                        <div
                          key={lbl}
                          style={{ background: COLORS.bg, borderRadius: 8, padding: '0.5rem 0.75rem' }}
                        >
                          <div style={{ fontSize: 10, color: COLORS.muted }}>{lbl}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: COLORS.muted, padding: '1rem' }}>No courses enrolled.</div>
            )}
        
            {/* CLASSES */}
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '2rem 0 1rem', color: '#e6edf3' }}>
              Classes{' '}
              <span style={{ color: COLORS.muted, fontSize: 13, fontWeight: 400 }}>
                ({s.classes?.length ?? 0})
              </span>
            </h2>
          
            {s.classes && s.classes.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {s.classes.map((cl: ClassItem) => (
                  <div
                    key={cl._id}
                    style={{
                      ...section,
                      marginBottom: 0,
                      borderTop: `3px solid ${COLORS.warn}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: `${COLORS.warn}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLORS.warn,
                          fontSize: 18,
                        }}
                      >
                        <MdClass />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{cl.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>
                          {cl.program} · Sem {cl.semester}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={badge(COLORS.muted)}>
                        {cl.students?.length ?? 0} student{(cl.students?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <span style={badge(COLORS.muted)}>
                        {cl.courses?.length ?? 0} course{(cl.courses?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <span style={badge(cl.isActive ? COLORS.present : COLORS.absent)}>
                        {cl.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: COLORS.muted, padding: '1rem' }}>No classes assigned.</div>
            )}
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {tab === 'attendance' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Attendance Records <span style={{ color: COLORS.muted, fontSize: 13, fontWeight: 400 }}>({attendance.length} entries)</span>
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={badge(COLORS.present)}><FiCheckCircle size={10} /> {present} Present</span>
                <span style={badge(COLORS.absent)}><FiXCircle size={10} /> {absent} Absent</span>
              </div>
            </div>

            {/* progress bar */}
            <div style={{ ...section, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: COLORS.muted }}>
                <span>Attendance Rate</span>
                <span style={{ color: attendanceColor, fontWeight: 700 }}>{presentPercent}%</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 100, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${presentPercent}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${attendanceColor}88, ${attendanceColor})`,
                  borderRadius: 100,
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: COLORS.muted }}>
                <span>0%</span>
                <span style={{ color: COLORS.warn }}>75% threshold</span>
                <span>100%</span>
              </div>
            </div>

            {/* table */}
            <div style={{ ...section, overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {['#', 'Date', 'Course', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '0.9rem 1.2rem', textAlign: 'left',
                        color: COLORS.muted, fontWeight: 600, fontSize: 11,
                        textTransform: 'uppercase', letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a: AttendanceRecord, i: number) => {
                    const course = s.courses.find((c: Course) => c._id === a.course)
                    const isPresent = a.status === 'PRESENT'
                    return (
                      <tr key={a._id} style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                        background: i % 2 === 0 ? 'transparent' : `${COLORS.border}30`,
                      }}>
                        <td style={{ padding: '0.8rem 1.2rem', color: COLORS.muted }}>{i + 1}</td>
                        <td style={{ padding: '0.8rem 1.2rem', whiteSpace: 'nowrap' }}>{fmt(a.date)}</td>
                        <td style={{ padding: '0.8rem 1.2rem' }}>
                          {course ? (
                            <span>
                              <span style={{ fontWeight: 600 }}>{course.code}</span>
                              <span style={{ color: COLORS.muted, marginLeft: 6, fontSize: 11 }}>{course.name}</span>
                            </span>
                          ) : <span style={{ color: COLORS.muted }}>—</span>}
                        </td>
                        <td style={{ padding: '0.8rem 1.2rem' }}>
                          <span style={badge(isPresent ? COLORS.present : COLORS.absent)}>
                            {isPresent ? <FiCheckCircle size={10} /> : <FiXCircle size={10} />}
                            {a.status}
                          </span>
                        </td>
                        {/* <td style={{ padding: '0.8rem 1.2rem', color: COLORS.muted }}>
                          {a.remarks || '—'}
                        </td> */}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}