const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-full text-sm table-fixed border-collapse">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th
                key={idx}
                className="px-4 py-3 bg-gray-200 rounded-t-lg animate-pulse"
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-200">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td
                  key={colIdx}
                  className="px-4 py-3 bg-gray-200 animate-pulse"
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
