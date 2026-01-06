"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  const dots = (<div className="ml-2 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#242526]/90" />
            <span className="w-3 h-3 rounded-full bg-[#242526]/90" />
            <span className="w-3 h-3 rounded-full bg-[#242526]/90" />
          </div>)

  pages.push(1);

  if (start > 2) {
    pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-3 pb-6 sm:pb-8 md:pb-10">
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="px-2 select-none"
            >
              {dots}
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-label={`Go to page ${page}`}
            onClick={() => {
              if (!isActive) {
                onPageChange(page);
              }
            }}
            className={`relative flex items-center justify-center rounded-full
              w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
              font-red-hat-mono font-extrabold
              ${
                isActive
                  ? "bg-[#242526] text-white"
                  : "bg-[#242526]/90 text-white hover:bg-[#242526]"
              }`}
          >
            {isActive && (
              <div
                className="absolute inset-0 rounded-full p-[3px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(137.77deg, #8EEBFF 10.19%, #28D781 37.77%, #F8FF1D 72.7%, #FF1717 97.98%)",
                }}
              >
                <div className="w-full h-full rounded-full bg-[#242526]"></div>
              </div>
            )}

            <span className="relative z-10 text-[18px] sm:text-[20px] md:text-[24px] leading-[100%] font-red-hat-mono">
              {page}
            </span>
          </button>
        );
      })}
    </div>
  );
}
