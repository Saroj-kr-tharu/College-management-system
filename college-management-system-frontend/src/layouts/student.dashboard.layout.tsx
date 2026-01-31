import { useState } from 'react';
import { Outlet } from 'react-router';
import { WithAuth } from '../components/hoc/with-auth.hoc';
import Header from '../components/navbar/header';
import SideMenu from '../components/sidebar/sidemenu';
import { Role } from '../types/enum';


const StudentDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className='flex h-screen w-screen bg-gray-100'>
      {/* Sidebar */}
      <SideMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 backdrop-blur-sm bg-black/30 z-40 md:hidden'
          onClick={closeSidebar}
        />
      )}

      {/* Content Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header (fixed at top) */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className='mt-16 p-6 flex-1 overflow-auto bg-gray-300'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Component = WithAuth(StudentDashboardLayout, [Role.STUDENT])
export default Component;
