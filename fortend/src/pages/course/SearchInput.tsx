interface IProps {
  placeholder: string
  id: string
  tempInputValue:string;
  setTempInputValue:(value:string)=>void
}

const SearchInput: React.FC<IProps> = ({ placeholder, id, tempInputValue,setTempInputValue }) => {
  return (
    <div>
      <input
      value={tempInputValue}
      onChange={(e)=>setTempInputValue(e.target.value)}
        type="text"
        id={id}
        placeholder={placeholder}
        className="
          w-full sm:w-1/3
          px-4 py-2
          text-sm text-gray-700
          bg-white
          border border-gray-300
          rounded-lg
          shadow-sm
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
          transition
          duration-200
        "
      />
    </div>
  )
}

export default SearchInput
