import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/client';
import CategoriesDropdown from './CategoriesDropdown';
import MobileMenu from './MobileMenu';

async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`;
  return await client.fetch(query);
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 w-full glass transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="The Trend Report Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            The Trend Report
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <CategoriesDropdown categories={categories} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Placeholder for future search or theme toggle */}
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}