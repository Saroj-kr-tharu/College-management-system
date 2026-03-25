import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStudentById } from '../../api/student.api';
import { getAttendanceByStudentId } from '../../api/attendance.api';
import StudentSkeleton from '../../skeleton/StudentSkeleton';
import { 
  MdArrowBack, 
  MdPrint, 
  MdPerson, 
  MdCalendarToday, 
  MdEmail, 
  MdPhone,
  MdSchool,
  MdDescription,
  MdClass,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md';

const StudentView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['get_student_by_id', id],
    queryFn: () => getStudentById(id as string),
    enabled: !!id,
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['get_attendance_by_student', id],
    queryFn: () => getAttendanceByStudentId(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <StudentSkeleton />;
  }

  const student = data?.data;
  const attendanceRecords = attendanceData?.data || [];

  const presentCount = attendanceRecords.filter((r: { status: string }) => r.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter((r: { status: string }) => r.status === 'ABSENT').length;
  const totalRecords = attendanceRecords.length;
  const attendancePercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex justify-center items-start">

      {/* Main Container */}
      <div className="max-w-5xl w-full">
        
        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate('/student')}
            className="inline-flex items-center gap-2
                       px-6 py-3 rounded-2xl
                       bg-white text-indigo-600 font-semibold
                       shadow-lg border-2 border-indigo-100
                       hover:bg-indigo-600 hover:text-white hover:border-indigo-600
                       hover:shadow-xl hover:scale-105
                       transition-all duration-300
                       cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
            Back to List
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2
                       px-6 py-3 rounded-2xl
                       bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold
                       shadow-lg
                       hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105
                       transition-all duration-300
                       cursor-pointer"
          >
            <MdPrint className="w-5 h-5" />
            Print / Save PDF
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Gradient Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Section */}
          <div className="px-8 pb-8">
            {/* Profile Image - Overlapping Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 relative z-10">
              <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gray-50 flex-shrink-0">
                <img
                  src={student.profile?.path}
                  alt={student.fullName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left mt-16 md:mt-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {student.fullName}
                </h2>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold">
                    <MdPerson className="w-4 h-4" />
                    {student.gender}
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-semibold">
                    <MdCalendarToday className="w-4 h-4" />
                    {new Date(student.dob).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MdEmail className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MdPhone className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">{student.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t-2 border-gray-100"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Academic Information Card */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <MdSchool className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Academic Information</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Program</p>
                      <p className="text-gray-800 font-medium">{student.program}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Semester</p>
                      <p className="text-gray-800 font-medium">{student.semester}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Enrolled Courses</p>
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((c: { _id: string; name: string }, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-white rounded-lg text-sm text-blue-700 font-medium shadow-sm border border-blue-100">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Details Card */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <MdDescription className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Registration Details</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Roll Number</p>
                      <p className="text-gray-800 font-medium">{student.rollNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Registration Number</p>
                      <p className="text-gray-800 font-medium">{student.registrationNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-1">•</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Address</p>
                      <p className="text-gray-800 font-medium">{student.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classes Information Card - FULL WIDTH */}
              <div className="md:col-span-2 group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <MdClass className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Assigned Classes</h3>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Active Classes</p>
                  <div className="flex flex-wrap gap-3">
                    {student.classes && student.classes.length > 0 ? (
                      student.classes.map((cls: { _id: string; name: string }, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-white rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
                          <p className="text-green-700 font-semibold">{cls.name}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No classes assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance Summary Card - FULL WIDTH */}
              <div className="md:col-span-2 group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <MdCheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Attendance Summary</h3>
                </div>

                {totalRecords > 0 ? (
                  <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-amber-100">
                        <p className="text-3xl font-bold text-gray-800">{totalRecords}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Total Records</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-green-200">
                        <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Present</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-200">
                        <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Absent</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-blue-200">
                        <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">Attendance Rate</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Attendance Rate</span>
                        <span className="font-semibold">{attendancePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            attendancePercentage >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            attendancePercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recent Attendance Records */}
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Recent Records</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-amber-100/50">
                              <th className="px-4 py-2 text-left font-semibold text-gray-700 rounded-tl-lg">Date</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">Course</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">Class</th>
                              <th className="px-4 py-2 text-center font-semibold text-gray-700 rounded-tr-lg">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceRecords.slice(0, 10).map((record: {
                              _id: string;
                              date: string;
                              status: string;
                              course: { _id: string; name: string; code: string } | null;
                              class: { _id: string; name: string } | null;
                            }) => (
                              <tr key={record._id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                                <td className="px-4 py-3 text-gray-700">
                                  {new Date(record.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {record.course ? `${record.course.code} - ${record.course.name}` : 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                  {record.class?.name || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                    record.status === 'PRESENT'
                                      ? 'bg-green-100 text-green-700'
                                      : record.status === 'LEAVE'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {record.status === 'PRESENT' ? (
                                      <MdCheckCircle className="w-3.5 h-3.5" />
                                    ) : (
                                      <MdCancel className="w-3.5 h-3.5" />
                                    )}
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {attendanceRecords.length > 10 && (
                        <p className="text-center text-sm text-gray-500 mt-3">
                          Showing 10 of {attendanceRecords.length} records
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No attendance records found</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center print:hidden">
          <p className="text-sm text-gray-600">
            Student profile • {student.program} • Semester {student.semester}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentView;
