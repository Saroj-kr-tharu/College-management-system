import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';
import {
  FaBook, FaChalkboardTeacher, FaGraduationCap, FaUserTie
} from 'react-icons/fa';
import { IoBookSharp } from 'react-icons/io5';
import {
  MdEmail, MdPerson, MdPhone, MdSchool,
  MdEdit, MdClose, MdSave, MdLock, MdVisibility, MdVisibilityOff,
} from 'react-icons/md';
import { getTeacherByEmail, updateTeacherProfile } from '../../api/teacher.api';
import { useAuth } from '../../context/auth.context';

interface Course {
  _id: string; code: string; name: string;
  creditHours: number; department: string; semester: number;
  program: string; isActive: boolean; createdAt: string; updatedAt: string;
}
interface TeacherData {
  profile: { path: string; public_id: string };
  _id: string; fullName: string; email: string; phone: string;
  gender: string; department: string; courses: Course[];
  isActive: boolean; createdAt: string; updatedAt: string;
}
interface ApiResponse {
  status: string; success: boolean; data: TeacherData; message: string;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: response, isLoading } = useQuery<ApiResponse>({
    queryFn: async () => {
      const data = await getTeacherByEmail(String(user?.email));
      return data;
    },
    queryKey: ['teacher-dashboard'],
  });

  const teacher = response?.data;

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('phone', phone);
      if (password) fd.append('password', password);
      if (photoFile) fd.append('profile', photoFile);
      return updateTeacherProfile(teacher!.email, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-dashboard'] });
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditOpen(false); }, 1800);
    },
  });

  const openEdit = () => {
    setPhone(teacher!.phone);
    setPassword('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setSaved(false);
    mutation.reset();
    setEditOpen(true);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    const r = new FileReader();
    r.onloadend = () => setPhotoPreview(r.result as string);
    r.readAsDataURL(f);
  };

  // Loading / empty states
  if (isLoading) return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4' />
      <p className='text-xl font-semibold text-gray-700 animate-pulse'>Loading Dashboard...</p>
    </div>
  );

  if (!teacher) return (
    <div className='flex items-center justify-center h-screen'>
      <p className='text-xl text-gray-500'>No teacher data found</p>
    </div>
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className='min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100'>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden'>

            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 flex items-center justify-between'>
              <h2 className='text-white text-lg font-bold'>Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className='text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all cursor-pointer'>
                <MdClose size={22} />
              </button>
            </div>

            {/* Body */}
            <div className='p-6 space-y-4'>

              {/* Photo */}
              <div className='flex flex-col items-center gap-2'>
                <div className='relative group cursor-pointer'>
                  <img
                    src={photoPreview || teacher.profile.path}
                    className='w-20 h-20 rounded-full object-cover ring-4 ring-purple-300 ring-offset-2'
                  />
                  <label htmlFor='teacher-photo-upload' className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity'>
                    <MdEdit size={22} className='text-white' />
                  </label>
                  <input id='teacher-photo-upload' type='file' accept='image/*' className='hidden' onChange={handlePhoto} />
                </div>
                <p className='text-xs text-gray-400'>Hover to change photo</p>
              </div>

              {/* Phone */}
              <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all'>
                <MdPhone size={18} className='text-gray-400' />
                <input
                  type='tel' value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder='Phone number'
                  className='flex-1 outline-none text-sm text-gray-800 placeholder-gray-400'
                />
              </div>

              {/* Password */}
              <div className='flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all'>
                <MdLock size={18} className='text-gray-400' />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder='New password (optional)'
                  className='flex-1 outline-none text-sm text-gray-800 placeholder-gray-400'
                />
                <button type='button' onClick={() => setShowPass(v => !v)} className='text-gray-400 hover:text-gray-600'>
                  {showPass ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>

              {mutation.isError && <p className='text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl'>Update failed. Try again.</p>}
              {saved && <p className='text-sm text-green-600 bg-green-50 px-4 py-2 rounded-xl'>Profile updated!</p>}
            </div>

            {/* Footer */}
            <div className='px-6 pb-6 flex gap-3'>
              <button onClick={() => setEditOpen(false)} className='flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all cursor-pointer'>
                Cancel
              </button>
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer'
              >
                {mutation.isPending
                  ? <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />Saving...</>
                  : <><MdSave size={18} />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='mb-8 animate-fadeIn'>
        <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
          Teacher Dashboard
        </h2>
        <p className='text-gray-600 mt-2'>Welcome back, {teacher.fullName}!</p>
      </div>

      {/* Profile Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>

          {/* Profile Image */}
          <div className='relative group'>
            <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500 ring-offset-4 transition-all duration-300 group-hover:ring-pink-500'>
              <img src={teacher.profile.path} alt={teacher.fullName} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' />
            </div>
            {teacher.isActive && (
              <div className='absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg'>
                Active
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-1 text-center md:text-left'>
            <div className='flex items-center gap-3 justify-center md:justify-start mb-2'>
              <h3 className='text-3xl font-bold text-gray-800'>{teacher.fullName}</h3>
              {/* Edit Button */}
              <button
                onClick={openEdit}
                className='flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-semibold shadow hover:shadow-md hover:scale-105 transition-all'
              >
                <MdEdit size={14} /> Edit
              </button>
            </div>

            <div className='flex flex-wrap gap-4 justify-center md:justify-start mb-4'>
              <span className='px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>{teacher.department}</span>
              <span className='px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold'>Faculty Member</span>
              <span className='px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>{teacher.gender}</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
              <InfoItem icon={<MdEmail size={18} />} label='Email' value={teacher.email} />
              <InfoItem icon={<MdPhone size={18} />} label='Phone' value={teacher.phone} />
              <InfoItem icon={<MdSchool size={18} />} label='Department' value={teacher.department} />
              <InfoItem icon={<MdPerson size={18} />} label='Status' value={teacher.isActive ? 'Active' : 'Inactive'} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard title='Teaching Courses' value={teacher.courses.length} icon={<FaBook size={28} className='text-white/80' />} gradient='from-blue-400 to-blue-600' delay='0' />
        <StatCard title='Total Credits' value={teacher.courses.reduce((sum, c) => sum + c.creditHours, 0)} icon={<BsFillJournalBookmarkFill size={28} className='text-white/80' />} gradient='from-purple-400 to-purple-600' delay='100' />
        <StatCard title='Active Courses' value={teacher.courses.filter(c => c.isActive).length} icon={<FaChalkboardTeacher size={28} className='text-white/80' />} gradient='from-pink-400 to-pink-600' delay='200' />
        <StatCard title='Department' value={teacher.department} icon={<FaUserTie size={28} className='text-white/80' />} gradient='from-green-400 to-green-600' delay='300' isText />
      </div>

      {/* Courses Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl'>
        <h3 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <IoBookSharp className='text-blue-600' size={28} /> Teaching Courses
        </h3>
        {teacher.courses.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {teacher.courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}
          </div>
        ) : (
          <div className='text-center py-12 text-gray-500'>
            <FaBook className='mx-auto mb-4 text-gray-300' size={48} />
            <p className='text-lg'>No courses assigned yet</p>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className='bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-2xl'>
        <h3 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <FaUserTie className='text-purple-600' size={28} /> Account Information
        </h3>
        <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500 hover:border-pink-500 transition-all duration-300'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[['Member Since', formatDate(teacher.createdAt)], ['Last Updated', formatDate(teacher.updatedAt)], ['Account Status', teacher.isActive ? 'Active' : 'Inactive']].map(([label, val]) => (
              <div key={label}>
                <p className='text-gray-600 text-sm mb-1'>{label}</p>
                <p className={`text-lg font-bold ${label === 'Account Status' ? (teacher.isActive ? 'text-green-600' : 'text-red-600') : 'text-gray-800'}`}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
    <div className='text-gray-500'>{icon}</div>
    <div>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='text-sm font-semibold text-gray-800'>{value}</p>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, gradient, delay, isText = false }: {
  title: string; value: number | string; icon: React.ReactNode;
  gradient: string; delay: string; isText?: boolean;
}) => (
  <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`} style={{ animationDelay: `${delay}ms` }}>
    <div className='flex items-center justify-between mb-4'>
      <div className='bg-white/30 p-3 rounded-lg'>{icon}</div>
      <div className={`${isText ? 'text-2xl' : 'text-4xl'} font-bold`}>{value}</div>
    </div>
    <p className='text-sm font-medium opacity-90'>{title}</p>
  </div>
);

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
  <div className='bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300 cursor-pointer' style={{ animationDelay: `${index * 50}ms` }}>
    <div className='flex items-start justify-between mb-3'>
      <div className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold'>{course.code}</div>
      <div className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold'>{course.creditHours} Credits</div>
    </div>
    <h4 className='font-bold text-gray-800 text-lg mb-2 line-clamp-2'>{course.name}</h4>
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm text-gray-600'>
        <span className='flex items-center gap-1'><MdSchool size={16} />{course.department}</span>
        <span className='flex items-center gap-1'><FaGraduationCap size={14} />Sem {course.semester}</span>
      </div>
      <div className='flex items-center justify-between text-sm'>
        <span className='text-gray-600'>{course.program}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {course.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </div>
);

export default TeacherDashboard;