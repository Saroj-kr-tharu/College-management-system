import { useEffect, useState } from 'react';
import { getAllClassesList } from '../../api/class.api';
import PageHeader from '../../components/header/page-header';
import StudentList from '../../components/student/list';
import { useAuth } from "../../context/auth.context";
import { PROGRAMS, Role, SEMESTER_OPTIONS } from "../../types/enum";
import SearchInput from './SearchInput';

const StudentPage = () => {
  const [tempInputValue, setTempInputValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [classList, setClassList] = useState<any[]>([]) 
  const { user } = useAuth()

  // 1. Handle Debounce for Search
  useEffect(() => {
    const interval = setTimeout(() => {
      setInputValue(tempInputValue)
    }, 500)

    return () => clearTimeout(interval)
  }, [tempInputValue])

  // 2. Fetch Class List for the Dropdown (Runs once on mount)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClassesList();
       
          setClassList(response?.data); 
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setClassList([]); 
      }
    };
    
    fetchClasses();
  }, []); 

  return (
    <main className='min-h-screen w-full p-0 flex flex-col gap-2'>
      
      {/* Page Header */}
      <PageHeader
        key='list-student'
        title='Student List'
        sub_title='All Students'
        {...(user?.role === Role.ADMIN && { button_text: 'Add Student' })}
        link_to='/student/add'
      />
      
      {/* Filters Area */}
      <div className='flex flex-wrap items-center gap-3'>
        <SearchInput 
          tempInputValue={tempInputValue}
          setTempInputValue={setTempInputValue}
          placeholder='Search students' id='search'
        />

        {/* Program Filter */}
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className='w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200'
        >
          <option value=''>All Programs</option>
          {PROGRAMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Semester Filter */}
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className='w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200'
        >
          <option value=''>All Semesters</option>
          {SEMESTER_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Class Filter (Dynamic) */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className='w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200'
        >
          <option value=''>All Classes</option>
          {/* Safe mapping: handles null/undefined/non-arrays */}
          {Array.isArray(classList) && classList.map((item) => (
            <option key={item._id || item.id} value={item._id || item.id}>
              {item.className || item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main List Display */}
      <div className='mx-auto w-full sm:px-0 lg:px-0'>
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Student List
          </h2>

          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />

          {/* 3. Pass the selectedClass to StudentList so it triggers a re-fetch */}
          <StudentList 
            inputValue={inputValue} 
            selectedProgram={selectedProgram} 
            selectedSemester={selectedSemester}
            selectedClass={selectedClass} 
          />
        </div>
      </div>
    </main>
  );
};

export default StudentPage;