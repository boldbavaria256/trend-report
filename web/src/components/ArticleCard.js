import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/client';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <Link
      href={`/articles/${article.slug?.current || article.slug}`}
      className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {article.mainImage?.asset ? (
          <Image
            src={urlFor(article.mainImage).width(600).height(338).fit('crop').url()}
            alt={article.mainImage.alt || article.title || 'Article image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center justify-between mb-4">
          {article.categories && article.categories.length > 0 && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              {article.categories[0].title}
            </span>
          )}
          <span className="text-xs text-gray-400 font-medium">
            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {article.title || 'Untitled Article'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {article.excerpt}
        </p>

        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white mt-auto group-hover:translate-x-2 transition-transform duration-300">
          Read Story
          <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}