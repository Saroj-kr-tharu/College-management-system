import { useEffect, useState } from "react"


const DatePicker = () => {
const [todayDate, setTodayDate] = useState<string>("");

useEffect(() => {
  const dateObj = new Date();
  const isoString = dateObj.toISOString().split("T")[0];
  setTodayDate(isoString);
}, []); 

console.log(todayDate);


  return (
    <>
    <input type="date" 
    value={todayDate}
    onChange={(e)=>setTodayDate(e.target.value)}
     className="
          w-full sm:w-1/3
          px-4 py-2
          text-md text-gray-700
          font-semibold
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
    </>
  )
}

export default DatePicker
