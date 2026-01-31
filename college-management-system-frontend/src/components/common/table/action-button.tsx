import { Link } from 'react-router';
import { CiEdit } from 'react-icons/ci';
import { CiTrash } from 'react-icons/ci';

interface IProps {
    onDelete: () => void,
    edit_link?: string
}

const ActionButtons: React.FC<IProps> = ({ edit_link='#', onDelete }) => {
    return (
        <div className='flex items-center gap-3 flex-wrap sm:flex-nowrap'>
            <Link 
                to={edit_link} 
                className='p-2 rounded-xl bg-gradient-to-r from-indigo-400 to-indigo-500 text-white
                            hover:from-indigo-500 hover:to-indigo-600
                            shadow-md hover:shadow-lg
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center'
            >
                <CiEdit size={20} className='cursor-pointer'/>
            </Link>
            <button
                onClick={onDelete}
                className='p-2 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white
                            hover:from-red-500 hover:to-red-600
                            shadow-md hover:shadow-lg
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center cursor-pointer'
            >
                <CiTrash size={20}/>
            </button>
        </div>

    )
}

export default ActionButtons;
