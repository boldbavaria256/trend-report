// web/src/components/Footer.js
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {currentYear} The Trend Report. All rights reserved.</p>
          {/* You can add more links here if needed, e.g., Privacy Policy, Terms */}
        </div>
      </footer>
    );
  }