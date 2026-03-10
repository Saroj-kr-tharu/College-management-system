import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getTeacherById } from '../../api/teacher.api';
import TeacherSkeleton from '../../skeleton/TeacherSkeleton';

const TeacherView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['get_teacher_by_id', id],
    queryFn: () => getTeacherById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <TeacherSkeleton />;
  }

  const teacher = data?.data;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      {/* Card with gradient */}
      <div className="max-w-6xl w-full bg-gradient-to-r from-green-200 via-teal-200 to-blue-300 rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <div className="mb-4 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate('/teacher')}
            className="inline-flex items-center gap-2
                       px-4 py-2 rounded-lg
                       bg-white text-green-600 font-medium
                       shadow-sm border border-green-100
                       hover:bg-green-600 hover:text-white
                       hover:shadow-md hover:-translate-y-0.5
                       transition-all duration-200
                       cursor-pointer"
          >
            ← Back to List
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2
                       px-4 py-2 rounded-lg
                       bg-green-600 text-white font-medium
                       shadow-sm
                       hover:bg-green-700 hover:shadow-md
                       transition-all duration-200
                       cursor-pointer"
          >
            Print / PDF
          </button>
        </div>

        {/* Card Content */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
          {/* Profile Image */}
          <div className="h-32 w-32 rounded-xl overflow-hidden border shadow-sm bg-gray-50 flex-shrink-0">
            <img
              src={teacher.profile?.path}
              alt={teacher.fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {teacher.fullName}
            </h2>
            <p className="text-gray-500 mt-1">{teacher.email}</p>
            <p className="text-gray-500">{teacher.phone}</p>

            <div className="mt-3 inline-block px-3 py-1 rounded-full text-sm
                            bg-green-100 text-green-700 font-medium">
              {teacher.gender}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Department & Courses */}
          <div className="bg-white rounded-xl p-6 shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Professional Information
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><b>Department:</b> {teacher.department}</p>
              <p>
                <b>Courses:</b>{' '}
                {teacher.courses.map((c: any) => c.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Other Details */}
          <div className="bg-white rounded-xl p-6 shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Contact Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><b>Email:</b> {teacher.email}</p>
              <p><b>Phone:</b> {teacher.phone}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherView;
