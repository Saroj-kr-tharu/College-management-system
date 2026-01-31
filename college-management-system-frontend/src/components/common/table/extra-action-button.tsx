import { Link } from 'react-router';
import { CiEdit, CiTrash } from 'react-icons/ci';

interface IProps {
  onDelete: () => void;
  edit_link?: string;
  view_link?: string;
}

const ActionButtons: React.FC<IProps> = ({ edit_link = '#', view_link, onDelete }) => {
  return (
    <div className='flex items-center gap-2 flex-wrap justify-center w-full'>
      <Link
        to={edit_link}
        className='flex-1 min-w-[40px] max-w-[80px] sm:flex-auto p-2 rounded-xl
                   bg-gradient-to-r from-indigo-400 to-indigo-500 text-white
                   hover:from-indigo-500 hover:to-indigo-600
                   shadow-md hover:shadow-lg
                   transition-all duration-300 ease-in-out
                   flex items-center justify-center'
      >
        <CiEdit size={20} className='cursor-pointer' />
      </Link>

      {view_link && (
        <Link
          to={view_link}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View
        </Link>
      )}

      <button
        onClick={onDelete}
        className='flex-1 min-w-[40px] max-w-[80px] sm:flex-auto p-2 rounded-xl
                   bg-gradient-to-r from-red-400 to-red-500 text-white
                   hover:from-red-500 hover:to-red-600
                   shadow-md hover:shadow-lg
                   transition-all duration-300 ease-in-out
                   flex items-center justify-center cursor-pointer'
      >
        <CiTrash size={20} />
      </button>
    </div>
  );
};

export default ActionButtons;
