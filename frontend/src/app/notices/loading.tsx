export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="h-20 bg-slate-900" />
      
      {/* Hero skeleton */}
      <div className="pt-12 pb-12 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="h-10 bg-white/20 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto animate-pulse" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 bg-amber-100 rounded-md w-32" />
              </div>
              <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
