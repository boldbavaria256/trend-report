'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Something went wrong!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                We encountered an unexpected error while loading this page. Please try again later.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Try again
            </button>
        </div>
    );
}
