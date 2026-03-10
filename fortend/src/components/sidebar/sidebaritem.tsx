import { Link } from 'react-router';

interface SidebarItemProps {
  to: string;
  label: string;
  activePath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, label, activePath }) => (
  <Link
    to={to}
    className={`block px-4 py-2 rounded-lg transition
      ${activePath === to ? 'font-bold text-indigo-500' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
  >
    {label}
  </Link>
);

export default SidebarItem;
