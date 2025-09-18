"use client"
export default function Error() {
  return (
    <div className="flex flex-col justify-center items-center h-screen  text-white p-4 rounded-lg shadow-lg">
      <div className="text-4xl mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          className="w-16 h-16 text-white"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m0 4v2m0-12V3m0 3v9m-1 9h2m1-9h2m-3 0h2M9 9h6"
          />
        </svg>
      </div>
      <p className="text-xl font-semibold">Oops! Something went wrong.</p>
      <p className="mt-2 text-sm">Please try again later or contact support.</p>
    </div>
  );
}