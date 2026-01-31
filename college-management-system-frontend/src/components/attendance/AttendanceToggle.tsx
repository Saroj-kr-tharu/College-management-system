import { AttendanceStatus } from "../../types/enum";

export default function AttendanceToggle({
  value,
  onChange
}: {
  value: AttendanceStatus;
  onChange: (v: AttendanceStatus) => void;
}) {
  const base =
    'px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer';

  return (
    <div className="flex gap-2">
      {Object.values(AttendanceStatus).map(status => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`${base} ${
            value === status
              ? status === 'PRESENT'
                ? 'bg-green-500 text-white'
                : status === 'ABSENT'
                ? 'bg-red-500 text-white'
                : 'bg-yellow-400 text-white'
              : 'bg-gray-100'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
