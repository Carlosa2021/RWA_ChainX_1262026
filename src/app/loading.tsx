// Global navigation loading state. Shown instantly during route transitions so
// clicks feel responsive instead of frozen while the next segment renders.
export default function Loading() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* Sidebar placeholder */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4 border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-full rounded-lg bg-gray-100 dark:bg-gray-900 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Main placeholder */}
      <div className="flex-1 flex flex-col">
        {/* Header placeholder */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <div className="h-6 w-40 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-9 w-36 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>

        {/* Content placeholder */}
        <div className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">
          <div className="h-8 w-56 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
