import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { postAttendance } from '../../api/attendance.api';
import { getAllClassesList, getClassById } from '../../api/class.api';
import { getAllStudentFilter } from '../../api/student.api';
import type { IAttendanceData } from '../../types/attendance.types';
import type { IClassResponse } from '../../types/class.types';
import type { ICourseResponse } from '../../types/course.types';
import { AttendanceStatus } from '../../types/enum';
import type { IStudentResponse } from '../../types/student.types';
import DatePicker from '../../components/attendance/DatePicker';

const AutoAttendance = () => {
  const [classes, setClasses] = useState<IClassResponse[]>([]);
  const [courses, setCourses] = useState<ICourseResponse[]>([]);
  const [students, setStudents] = useState<IStudentResponse[]>([]);
  const [classId, setClassId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Fetch Classes only
  useEffect(() => {
    getAllClassesList()
      .then(res => setClasses(res.data || res))
      .catch(() => toast.error('Failed to fetch classes'));
  }, []);

  // Fetch courses based on selected class
  useEffect(() => {
    if (!classId) {
      setCourses([]);
      setCourseId('');
      setStudents([]);
      setStatusMap({});
      return;
    }

    setCoursesLoading(true);
    getClassById(classId)
      .then(res => {
        const classData = res.data || res;
        const classCourses: ICourseResponse[] = classData.courses || [];
        setCourses(classCourses);
        setCourseId('');      // reset course when class changes
        setStudents([]);      // reset students
        setStatusMap({});
      })
      .catch(() => toast.error('Failed to fetch courses for this class'))
      .finally(() => setCoursesLoading(false));
  }, [classId]);

  // Fetch Students when both classId and courseId are selected
  useEffect(() => {
    if (!classId || !courseId) {
      setStudents([]);
      setStatusMap({});
      return;
    }

    setLoading(true);
    const filterData = { class: classId, course: courseId };

    getAllStudentFilter(1, 100, filterData)
      .then(res => {
        const studentsData: IStudentResponse[] = res?.data?.data || res?.data || [];
        setStudents(studentsData);

        const initialStatus: Record<string, AttendanceStatus> = {};
        studentsData.forEach(student => {
          initialStatus[student._id] = AttendanceStatus.PRESENT;
        });
        setStatusMap(initialStatus);
      })
      .catch(err => {
        toast.error(err?.message || 'Failed to fetch students');
        setStudents([]);
        setStatusMap({});
      })
      .finally(() => setLoading(false));
  }, [classId, courseId]);

  const handleToggleStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const newStatus: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      newStatus[student._id] = status;
    });
    setStatusMap(newStatus);
  };

  const { mutate: submitAttendance, isPending } = useMutation({
    mutationFn: async (attendanceData: IAttendanceData[]) => {
      const results = await Promise.allSettled(attendanceData.map(data => postAttendance(data)));
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) throw new Error(`Failed to save ${failures.length} record(s)`);
      return results;
    },
    onSuccess: () => toast.success('Attendance saved successfully'),
    onError: (error: any) => toast.error(error?.message || 'Failed to save attendance'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !courseId) return toast.error('Please select class and course');
    if (students.length === 0) return toast.error('No students to mark attendance');

    const attendanceData: IAttendanceData[] = students.map(student => ({
      student: student._id,
      class: classId,
      course: courseId,
      date,
      status: statusMap[student._id] || AttendanceStatus.ABSENT,
    }));

    submitAttendance(attendanceData);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Attendance</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Class Dropdown */}
          <select
            value={classId}
            onChange={e => setClassId(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>

          {/* Course Dropdown — only shows after class is selected */}
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            required
            disabled={!classId || coursesLoading} // disabled until class selected
          >
            <option value="">
              {coursesLoading ? 'Loading courses...' : !classId ? 'Select Class First' : 'Select Course'}
            </option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.name}</option>
            ))}
          </select>

          <DatePicker
            value={date}
            onChange={setDate}
            maxDate={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Bulk Buttons */}
        {students.length > 0 && (
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => markAll(AttendanceStatus.PRESENT)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => markAll(AttendanceStatus.ABSENT)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition cursor-pointer"
            >
              Mark All Absent
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Loading students...</p>
          </div>
        )}

        {/* Students Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {students.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                {classId && courseId
                  ? 'No students found for selected class and course'
                  : 'Please select class and course to view students'}
              </div>
            )}

            {students.map(student => (
              <div
                key={student._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={student.profile?.path || '/default-avatar.png'}
                    alt={student.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-gray-800 font-semibold text-lg text-center">{student.fullName}</div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(student._id, AttendanceStatus.PRESENT)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      statusMap[student._id] === AttendanceStatus.PRESENT
                        ? 'bg-green-500 text-white cursor-pointer'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-300 cursor-pointer'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(student._id, AttendanceStatus.ABSENT)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      statusMap[student._id] === AttendanceStatus.ABSENT
                        ? 'bg-red-500 text-white cursor-pointer'
                        : 'bg-gray-200 text-gray-700 hover:bg-red-300 cursor-pointer'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || loading || students.length === 0}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition ${
              isPending || loading || students.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isPending ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutoAttendance;