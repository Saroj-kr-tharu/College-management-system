import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import DropdownItem from './dropdownitem';
import SidebarItem from './sidebaritem';
import { sidebarLinks } from './links';
import { useLocation } from 'react-router';


interface SideMenuProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen = false, toggleSidebar }) => {
  const location = useLocation();
  const activePath = location.pathname;

  // Track open dropdowns dynamically
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 z-50 md:hidden backdrop-blur-sm'
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-indigo-600/30 h-screen transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:inset-auto
          flex flex-col
        `}
      >
        {/* Header */}
        <div className='flex-shrink-0 flex justify-between items-center px-6 py-4 text-2xl font-bold text-indigo-600 border-b border-black/20'>
          CollegeMS
          {toggleSidebar && (
            <button className='md:hidden text-2xl' onClick={toggleSidebar}>
              <HiX />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto px-2 py-4 space-y-2'>
          {sidebarLinks.map((link) =>
            link.subLinks ? (
              <DropdownItem
                key={link.label}
                title={link.label}
                isOpen={!!openDropdowns[link.label]}
                toggle={() => toggleDropdown(link.label)}
                subItems={link.subLinks}
                activePath={activePath}
              />
            ) : (
              <SidebarItem
                key={link.label}
                to={link.to!}
                label={link.label}
                activePath={activePath}
              />
            )
          )}
        </nav>

        {/* Sidebar Footer */}
          <div className='mt-auto flex flex-col items-center py-4'>
            <hr className='w-full border-gray-300 mb-4' />
            <span className='text-gray-950 text-sm'>
              &copy; 2025 CollegeMS
            </span>
          </div>

      </aside>
    </>
  );
};

export default SideMenu;
