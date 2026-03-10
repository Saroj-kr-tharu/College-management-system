const TeacherSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start animate-pulse">
      <div className="max-w-6xl w-full bg-gradient-to-r from-green-200 via-teal-200 to-blue-300 rounded-2xl shadow-xl p-8">
        
        {/* Buttons Skeleton */}
        <div className="mb-4 flex justify-between items-center">
          <div className="h-10 w-32 bg-white rounded-lg"></div>
          <div className="h-10 w-32 bg-green-600 rounded-lg"></div>
        </div>

        {/* Card Content Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
          {/* Profile Image Skeleton */}
          <div className="h-32 w-32 rounded-xl bg-gray-200 flex-shrink-0"></div>

          {/* Basic Info Skeleton */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded-md mx-auto md:mx-0"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-md mx-auto md:mx-0"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-md mx-auto md:mx-0"></div>
            <div className="h-5 w-24 bg-green-200 rounded-full mx-auto md:mx-0 mt-3"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* Details Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department & Courses */}
          <div className="bg-white rounded-xl p-6 shadow-inner space-y-3">
            <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Other Details */}
          <div className="bg-white rounded-xl p-6 shadow-inner space-y-3">
            <div className="h-5 w-32 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSkeleton;
