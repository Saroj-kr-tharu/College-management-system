type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
};

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) => {
  return (
    <input
      type="date"
      value={value}
      min={minDate}
      max={maxDate}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full sm:w-1/3
        px-4 py-2
        text-md font-semibold
        bg-white border rounded-lg shadow-sm
        outline-none transition duration-200
        ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        }
      `}
    />
  );
};

export default DatePicker;
