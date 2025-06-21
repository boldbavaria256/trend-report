// web/src/components/ArticleCard.js

import Image from 'next/image';
import Link from 'next/link'; // We'll use Next.js Link for navigation
import { urlFor } from '@/sanity/client';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <article key={article._id} className="border p-4 rounded-lg shadow-md dark:border-gray-700 flex flex-col">
      {article.mainImage && article.mainImage.asset && (
        <Link href={`/articles/${article.slug?.current || article.slug}`} className="mb-3 block aspect-[16/9] relative w-full overflow-hidden rounded">
          <Image
            src={urlFor(article.mainImage).width(400).height(225).fit('crop').url()}
            alt={article.mainImage.alt || article.title || 'Article image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out" // Example hover effect
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
          <Link href={`/articles/${article.slug?.current || article.slug}`}>
            {article.title || 'Untitled Article'}
          </Link>
        </h3>
        {/* Optional: Display categories */}
        {/* {article.categories && article.categories.length > 0 && (
          <div className="mb-2 text-xs">
            {article.categories.map(category => (
              <span key={category._id} className="mr-2 p-1 bg-gray-200 dark:bg-gray-700 rounded">
                {category.title}
              </span>
            ))}
          </div>
        )} */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 flex-grow">
          {article.excerpt || 'No excerpt available.'}
        </p>
        <Link
          href={`/articles/${article.slug?.current || article.slug}`}
          className="text-blue-600 hover:underline dark:text-blue-400 self-start mt-auto"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}