// web/src/components/Header.js
import Link from 'next/link';
import { client } from '@/sanity/client';
import CategoriesDropdown from './CategoriesDropdown'; // <--- IMPORT CLIENT COMPONENT

async function getCategories() {
  // ... (getCategories function remains the same)
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`;
  const categories = await client.fetch(query);
  return categories;
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          The Trend Report
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <CategoriesDropdown categories={categories} /> {/* <--- USE CLIENT COMPONENT */}
          {/* <Link href="/about" className="hover:text-gray-300">About</Link> */}
        </div>
      </nav>
    </header>
  );
}