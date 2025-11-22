import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }) {
  // Helper to build URL with existing search params + new page
  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    return `${baseUrl}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2" aria-label="Pagination">
        {/* Previous Button */}
        <Link
          href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
          className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
            currentPage <= 1 
              ? 'border-gray-200 text-gray-400 pointer-events-none' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          aria-disabled={currentPage <= 1}
        >
          Previous
        </Link>

        {/* Page Numbers */}
        <div className="hidden sm:flex gap-2">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Show first, last, current, and neighbors
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Link
                  key={page}
                  href={getPageUrl(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  style={page === currentPage ? { backgroundColor: 'var(--primary)' } : {}}
                >
                  {page}
                </Link>
              );
            } else if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < totalPages)
            ) {
              return (
                <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-500">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        {/* Next Button */}
        <Link
          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
          className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
            currentPage >= totalPages 
              ? 'border-gray-200 text-gray-400 pointer-events-none' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Next
        </Link>
      </nav>
    </div>
  );
}
