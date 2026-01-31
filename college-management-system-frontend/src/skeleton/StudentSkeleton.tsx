const StudentSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl p-8 animate-pulse space-y-6">
        {/* Skeleton for buttons */}
        <div className="flex justify-between mb-4">
          <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Skeleton for profile and basic info */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="h-32 w-32 bg-gray-300 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
            <div className="h-6 w-1/6 bg-gray-300 rounded-full mt-2"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Skeleton for details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-6 bg-gray-200 rounded-xl h-40"></div>
          <div className="space-y-2 p-6 bg-gray-200 rounded-xl h-40"></div>
        </div>
      </div>
    </div>
  );
};

export default StudentSkeleton;
