import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { postAttendance } from '../../api/attendance.api';
import { getAllClassesList } from '../../api/class.api';
import { getAllCoursesList } from '../../api/course.api';
import { getAllStudentFilter } from '../../api/student.api';
import type { IAttendanceData } from '../../types/attendance.types';
import type { IClassResponse } from '../../types/class.types';
import type { ICourseResponse } from '../../types/course.types';
import { AttendanceStatus } from '../../types/enum';
import type { IStudentResponse } from '../../types/student.types';

const AutoAttendance = () => {
  
  const [classes, setClasses] = useState<IClassResponse[]>([]);
  const [courses, setCourses] = useState<ICourseResponse[]>([]);
  const [students, setStudents] = useState<IStudentResponse[]>([]);
  const [classId, setClassId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);

  /* Fetch Classes & Courses on mount */
  useEffect(() => {
    getAllClassesList()
      .then(res => setClasses(res.data || res))
      .catch(() => toast.error('Failed to fetch classes'));

    getAllCoursesList()
      .then(res => setCourses(res.data || res))
      .catch(() => toast.error('Failed to fetch courses'));
  }, []);

  /* Fetch Students whenever classId or courseId changes */
  useEffect(() => {
    if (!classId || !courseId) {
      setStudents([]);
      setStatusMap({});
      return;
    }

    setLoading(true);
    
    // Prepare filter data
    const filterData = {
      class: classId,
      course: courseId,
    };

    getAllStudentFilter(1, 100, filterData)
      .then(res => {
        const studentsData: IStudentResponse[] = res?.data?.data || res?.data || [];
        setStudents(studentsData);
        
        // Initialize all students as PRESENT by default
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
      .finally(() => {
        setLoading(false);
      });
  }, [classId, courseId]);

  /* Handle Checkbox Change */
  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: checked ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
    }));
  };

  /* Submit Attendance Mutation */
  const { mutate: submitAttendance, isPending } = useMutation({
    mutationFn: async (attendanceData: IAttendanceData[]) => {
      // Submit all attendance records
      const results = await Promise.allSettled(
        attendanceData.map(data => postAttendance(data))
      );
      
      // Check for failures
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        throw new Error(`Failed to save ${failures.length} attendance record(s)`);
      }
      
      return results;
    },
    onSuccess: () => {
      toast.success('Attendance saved successfully');
      
      // Optionally re-fetch to verify
      if (classId && courseId) {
        const filterData = {
          class: classId,
          course: courseId,
        };
        
        getAllStudentFilter(1, 100, filterData)
          .then(res => {
            const studentsData: IStudentResponse[] = res?.data?.data || res?.data || [];
            setStudents(studentsData);
            toast.success('Attendance verified');
          })
          .catch(() => {
            toast.error('Failed to verify attendance');
          });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save attendance');
    },
  });

  /* Handle Form Submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classId || !courseId) {
      toast.error('Please select class and course');
      return;
    }
    
    if (students.length === 0) {
      toast.error('No students to mark attendance for');
      return;
    }

    // Prepare attendance data
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Auto Attendance</h1>

      <form onSubmit={handleSubmit}>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={classId}
            onChange={e => setClassId(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading students...</p>
          </div>
        )}

        {/* Students Table */}
        {!loading && (
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Student Name</th>
                  <th className="border p-2 text-center">Present</th>
                  <th className="border p-2 text-center">Absent</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan={3} className="border p-4 text-center text-gray-500">
                      {classId && courseId
                        ? 'No students found for selected class and course'
                        : 'Please select class and course to view students'}
                    </td>
                  </tr>
                )}
                {students.map(student => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="border p-2">{student.fullName}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={statusMap[student._id] === AttendanceStatus.PRESENT}
                        onChange={e => handleCheckboxChange(student._id, e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={statusMap[student._id] === AttendanceStatus.ABSENT}
                        onChange={e => handleCheckboxChange(student._id, !e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || loading || students.length === 0}
            className={`px-6 py-2 rounded font-semibold ${
              isPending || loading || students.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
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