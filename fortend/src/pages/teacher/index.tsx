import { useEffect, useState } from 'react';
import { getAllClassesList } from '../../api/class.api';
import PageHeader from '../../components/header/page-header';
import TeacherList from '../../components/teacher/list';
import SearchInput from './SearchInput';

const DEPARTMENTS = [
  { label: 'Information Technology Engineering', value: 'IT' },
  { label: 'Computer Engineering', value: 'CMP' },
  { label: 'Civil Engineering', value: 'CIVIL' },
  { label: 'Computer Science', value: 'BCA' },
];

const TeacherPage = () => {
  const [tempInputValue, setTempInputValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const [selectedClass, setSelectedClass] = useState('')
  const [classList, setClassList] = useState<any[]>([]) 

  useEffect(()=>{
    const interval = setTimeout(()=>{
      setInputValue(tempInputValue)
    },500)

    return()=> clearTimeout(interval)
  },[tempInputValue])


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
        key='list-teacher'
        title='Teacher List'
        sub_title='All Teachers'
        button_text='Add Teacher'
        link_to='/teacher/add'
      />

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3'>
        <SearchInput 
          tempInputValue={tempInputValue}
          setTempInputValue={setTempInputValue}
          placeholder='Search teachers' id='search'
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className='w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200'
        >
          <option value=''>All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        
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

      

      {/* Main content */}
      <div className='mx-auto w-full sm:px-0 lg:px-0'>
        
        {/* Intro */}
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Teacher List
          </h2>

          {/* Horizontal line */}
          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />


          <TeacherList inputValue={inputValue} selectedDepartment={selectedDepartment} selectedClass={selectedClass}/>

        </div>
      </div>
    </main>
  );
};

export default TeacherPage;
