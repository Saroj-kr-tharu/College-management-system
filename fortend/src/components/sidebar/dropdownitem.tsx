import { HiChevronRight, HiChevronDown } from 'react-icons/hi';
import { Link } from 'react-router';


interface SubItem {
  label: string;
  to: string;
}

interface DropdownItemProps {
  title: string;
  isOpen: boolean;
  toggle: () => void;
  subItems: SubItem[];
  activePath: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ title, isOpen, toggle, subItems, activePath }) => (
  <div>
    <button
      className='w-full flex justify-between items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition'
      onClick={toggle}
    >
      {title}
      {isOpen ? <HiChevronDown /> : <HiChevronRight />}
    </button>
    {isOpen && (
      <div className='pl-6 flex flex-col space-y-1 mt-1'>
        {subItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block px-4 py-2 rounded-lg transition
              ${activePath === item.to ? 'font-bold text-indigo-500' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default DropdownItem;
