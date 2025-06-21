// web/src/components/CategoriesDropdown.js
'use client'; // <--- This marks it as a Client Component

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function CategoriesDropdown({ categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="hover:text-gray-300 focus:outline-none px-2 py-1 rounded inline-flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Categories <span className={`ml-1 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span> {/* Arrow rotation */}
      </button>
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => setIsOpen(false)} // Close dropdown on link click
            >
              {category.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}