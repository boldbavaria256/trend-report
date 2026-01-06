import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/client';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <Link
      href={`/articles/${article.slug?.current || article.slug}`}
      className="group flex flex-col h-full floating-card rounded-2xl overflow-hidden"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {article.mainImage?.asset ? (
          <Image
            src={urlFor(article.mainImage).width(800).height(450).fit('crop').url()}
            alt={article.mainImage.alt || article.title || 'Article image'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-widest">Image Unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          {article.categories && article.categories.length > 0 && (
            <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase opacity-70">
              {article.categories[0].title}
            </span>
          )}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <h3 className="text-2xl font-bold leading-[1.2] mb-4 tracking-tight group-hover:text-accent transition-colors">
          {article.title || 'Untitled Article'}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8 font-medium">
          {article.excerpt}
        </p>

        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.25em] mt-auto">
          <span className="border-b-[2px] border-accent pb-1 group-hover:pr-4 transition-all">Read Record</span>
          <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}