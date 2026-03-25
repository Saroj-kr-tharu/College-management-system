
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import { Role } from "../../types/enum";
import StudentReport from "./student.report";
import TeacherReport, { type TeacherReportData } from "./teacher.report";
import { genReport } from "../../api/report.api";
import toast from "react-hot-toast";

const ReportGenerate = () => {
  const { user } = useAuth();
  // const [genRes, setGenRes] = useState('');
  const [genRes, setGenRes] = useState<TeacherReportData | null>(null);

  useEffect(() => {
    genReport(user?.email)
      .then(res => setGenRes(res.data || res))
      .catch(() => toast.error('Failed to fetch classes'));

  }, []);

  return (
    <main className='min-h-screen w-full p-0'>

      {/* Main content */}
      <div className='mx-auto w-full sm:px-0 lg:px-0 mt-6 md:mt-6'>
        
        {/* Intro */}
        <div className='bg-white shadow-sm rounded-sm p-4 sm:p-6 md:p-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center mb-3 sm:mb-4'>
            Report Generate
          </h2>

          {/* Horizontal line */}
          <hr className='border-t-2 border-gray-300 mb-4 w-full mx-auto' />

          {/* { user?.role === Role.TEACHER 
              ? <TeacherReport data={genRes} />  
              : <StudentReport data={genRes} /> 
          } */}

          {user?.role === Role.TEACHER 
            ? genRes && <TeacherReport data={genRes} />  
            : genRes && <StudentReport data={genRes} /> 
          }
          

        </div>
      </div>
    </main>
  );
};

export default ReportGenerate;
