export const CourseCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
};