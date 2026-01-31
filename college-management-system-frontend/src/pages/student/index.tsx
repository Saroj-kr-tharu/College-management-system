import StudentList from '../../components/student/list';
import PageHeader from '../../components/header/page-header';
import SearchInput from './SearchInput';
import { useEffect, useState } from 'react';

const StudentPage = () => {
  const [tempInputValue, setTempInputValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(()=>{
    const interval = setTimeout(()=>{
      setInputValue(tempInputValue)
    },500)

    return()=> clearTimeout(interval)
  },[tempInputValue])

  console.log({inputValue})

  return (
    <main className='min-h-screen w-full p-0 flex flex-col gap-2'>
      
      {/* Page Header */}
      <PageHeader
        key='list-student'
        title='Student List'
        sub_title='All Students'
        button_text='Add Student'
        link_to='/student/add'
      />
      
      {/* search inputField */}
      <SearchInput 
      tempInputValue={tempInputValue}
      setTempInputValue={setTempInputValue}
      placeholder='Search students' id='search'/>

      {/* Main content */}
      <div className='mx-auto w-full sm:px-0 lg:px-0'>
        
        {/* Intro */}
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Student List
          </h2>

          {/* Horizontal line */}
          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />

          <StudentList inputValue={inputValue}/>

        </div>
      </div>
    </main>
  );
};

export default StudentPage;
