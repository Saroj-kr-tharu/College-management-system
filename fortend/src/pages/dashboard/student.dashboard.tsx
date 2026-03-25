import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBook, FaCalendarAlt, FaUserGraduate, FaGraduationCap } from 'react-icons/fa';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';
import { IoBookSharp } from 'react-icons/io5';
import {
  MdCake, MdClass, MdEmail, MdLocationOn, MdNumbers, MdPerson,
  MdPhone, MdSchool, MdEdit, MdClose, MdSave, MdLock,
  MdVisibility, MdVisibilityOff,
} from 'react-icons/md';
import { getStudentByEmail, updateStudentProfile } from '../../api/student.api';
import { useAuth } from '../../context/auth.context';

interface Course {
  _id: string; code: string; name: string;
  creditHours: number; department: string; semester: number; program: string;
}
interface Class {
  _id: string; name: string; program: string; semester: number;
}
interface StudentData {
  student: {
    profile: { path: string; public_id: string };
    _id: string; fullName: string; email: string; phone: string;
    address: string; dob: string; gender: string; rollNumber: string;
    registrationNumber: string; program: string; semester: number;
    courses: Course[]; classes: Class[]; isActive: boolean;
  };
}
interface ApiResponse {
  status: string; success: boolean; data: StudentData; message: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: response, isLoading } = useQuery<ApiResponse>({
    queryFn: async () => {
      const data = await getStudentByEmail(String(user?.email));
      return data;
    },
    queryKey: ['student-dashboard'],
  });

  const student = response?.data?.student;

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('phone', phone);
      fd.append('address', address);
      if (password) fd.append('password', password);
      if (photoFile) fd.append('profile', photoFile);
      return updateStudentProfile(student!.email, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditOpen(false); }, 1800);
    },
  });

  const openEdit = () => {
    setPhone(student!.phone);
    setAddress(student!.address);
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

  if (!student) return (
    <div className='flex items-center justify-center h-screen'>
      <p className='text-xl text-gray-500'>No student data found</p>
    </div>
  );

  const calculateAge = (dob: string) => {
    const b = new Date(dob), t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    if (t.getMonth() - b.getMonth() < 0 || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
    return age;
  };

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
                    src={photoPreview || student.profile.path}
                    className='w-20 h-20 rounded-full object-cover ring-4 ring-purple-300 ring-offset-2'
                  />
                  <label htmlFor='photo-upload' className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity'>
                    <MdEdit size={22} className='text-white' />
                  </label>
                  <input id='photo-upload' type='file' accept='image/*' className='hidden' onChange={handlePhoto} />
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

              {/* Address */}
              <div className='flex items-start gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all'>
                <MdLocationOn size={18} className='text-gray-400 mt-0.5' />
                <textarea
                  value={address} onChange={e => setAddress(e.target.value)}
                  placeholder='Address' rows={2}
                  className='flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 resize-none'
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
      <div className='mb-8'>
        <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
          Student Dashboard
        </h2>
        <p className='text-gray-600 mt-2'>Welcome back, {student.fullName}!</p>
      </div>

      {/* Profile Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>

          {/* Profile Image */}
          <div className='relative group'>
            <div className='w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500 ring-offset-4 transition-all duration-300 group-hover:ring-pink-500'>
              <img src={student.profile.path} alt={student.fullName} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' />
            </div>
            {student.isActive && (
              <div className='absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg'>
                Active
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-1 text-center md:text-left'>
            <div className='flex items-center gap-3 justify-center md:justify-start mb-2'>
              <h3 className='text-3xl font-bold text-gray-800'>{student.fullName}</h3>
              {/* Edit Button */}
              <button
                onClick={openEdit}
                className='flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-semibold shadow hover:shadow-md hover:scale-105 transition-all'
              >
                <MdEdit size={14} /> Edit
              </button>
            </div>

            <div className='flex flex-wrap gap-4 justify-center md:justify-start mb-4'>
              <span className='px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>{student.program}</span>
              <span className='px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold'>Semester {student.semester}</span>
              <span className='px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold'>{student.gender}</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
              <InfoItem icon={<MdEmail size={18} />} label='Email' value={student.email} />
              <InfoItem icon={<MdPhone size={18} />} label='Phone' value={student.phone} />
              <InfoItem icon={<MdLocationOn size={18} />} label='Address' value={student.address} />
              <InfoItem icon={<MdCake size={18} />} label='Age' value={`${calculateAge(student.dob)} years`} />
              <InfoItem icon={<MdNumbers size={18} />} label='Roll No' value={student.rollNumber} />
              <InfoItem icon={<MdPerson size={18} />} label='Reg No' value={student.registrationNumber} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard title='Enrolled Courses' value={student.courses.length} icon={<FaBook size={28} className='text-white/80' />} gradient='from-indigo-500 to-indigo-700' />
        <StatCard title='Total Credits' value={student.courses.reduce((s, c) => s + c.creditHours, 0)} icon={<BsFillJournalBookmarkFill size={28} className='text-white/80' />} gradient='from-purple-500 to-purple-700' />
        <StatCard title='Current Semester' value={student.semester} icon={<FaCalendarAlt size={28} className='text-white/80' />} gradient='from-pink-500 to-pink-700' />
        <StatCard title='Active Classes' value={student.classes?.length || 0} icon={<MdClass size={28} className='text-white/80' />} gradient='from-green-500 to-green-700' />
      </div>

      {/* Courses */}
      <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-2xl'>
        <h3 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <IoBookSharp className='text-blue-600' size={28} /> Enrolled Courses
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {student.courses.map((course, i) => <CourseCard key={course._id} course={course} index={i} />)}
        </div>
      </div>

      {/* Classes */}
      {student.classes?.length > 0 && (
        <div className='bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl'>
          <h3 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
            <FaUserGraduate className='text-purple-600' size={28} />
            Current {student.classes.length > 1 ? 'Classes' : 'Class'}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {student.classes.map(cls => (
              <div key={cls._id} className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500 hover:border-pink-500 transition-all duration-300'>
                <div className='grid grid-cols-3 gap-4'>
                  {[['Class Name', cls.name], ['Program', cls.program], ['Semester', cls.semester]].map(([label, val]) => (
                    <div key={label as string}>
                      <p className='text-gray-600 text-sm mb-1'>{label}</p>
                      <p className='text-xl font-bold text-gray-800'>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

const StatCard = ({ title, value, icon, gradient }: { title: string; value: number; icon: React.ReactNode; gradient: string }) => (
  <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
    <div className='flex items-center justify-between mb-4'>
      <div className='bg-white/30 p-3 rounded-lg'>{icon}</div>
      <div className='text-4xl font-bold'>{value}</div>
    </div>
    <p className='text-sm font-medium opacity-90'>{title}</p>
  </div>
);

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
  <div
    className='bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300 cursor-pointer'
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className='flex items-start justify-between mb-3'>
      <div className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold'>{course.code}</div>
      <div className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold'>{course.creditHours} Credits</div>
    </div>
    <h4 className='font-bold text-gray-800 text-lg mb-2 line-clamp-2'>{course.name}</h4>
    <div className='flex items-center justify-between text-sm text-gray-600'>
      <span className='flex items-center gap-1'><MdSchool size={16} />{course.department}</span>
      <span className='flex items-center gap-1'><FaGraduationCap size={14} />Sem {course.semester}</span>
    </div>
  </div>
);

export default StudentDashboard;