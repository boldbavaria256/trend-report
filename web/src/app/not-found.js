import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 mb-4">
                404
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 relative -mt-16">
                Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
                Return Home
            </Link>
        </div>
    );
}
