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
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full shadow-sm placeholder-gray-400"
      />
    </div>
  )
}

export default SearchInput
