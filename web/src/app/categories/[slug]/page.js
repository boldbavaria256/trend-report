// web/src/app/categories/[slug]/page.js

import { client, urlFor } from '@/sanity/client';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { notFound } from 'next/navigation';

const ARTICLES_PER_PAGE = 15;

async function getCategoryData(slug, page = 1) {
  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;

  const categoryQuery = `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "slug": slug.current
  }`;

  const articlesQuery = `*[_type == "article" && references(*[_type=="category" && slug.current == $slug]._id)] | order(publishedAt desc) [${startIndex}...${endIndex}] {
    _id,
    title,
    "slug": slug.current,
    mainImage {
      asset->{_id, url, metadata {dimensions}},
      alt
    },
    excerpt,
    publishedAt,
    categories[]->{_id, title}
  }`;

  const totalArticlesInCategoryQuery = `count(*[_type == "article" && references(*[_type=="category" && slug.current == $slug]._id)])`;
  
  const [category, articles, totalArticles] = await Promise.all([
    client.fetch(categoryQuery, { slug }),
    client.fetch(articlesQuery, { slug }),
    client.fetch(totalArticlesInCategoryQuery, { slug })
  ]);

  return { category, articles, totalArticles };
}

export default async function CategoryPage({ params, searchParams }) {
  const categorySlug = params.slug;
  const currentPage = parseInt(searchParams?.page) || 1;

  const { category, articles, totalArticles } = await getCategoryData(categorySlug, currentPage);

  if (!category) {
    notFound(); 
  }

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const buttonBaseStyle = "px-4 py-2 rounded-md transition-colors text-sm font-medium";
  const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600`;
  const disabledButtonStyle = `${buttonBaseStyle} bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10 md:space-y-12">
      <header className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {category.description}
          </p>
        )}
      </header>

      {articles && articles.length > 0 ? (
        <section aria-labelledby="category-articles-heading">
          <h2 id="category-articles-heading" className="sr-only">
            Articles in {category.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 py-8 text-center text-lg">
          {/* --- THIS IS THE CORRECTED LINE --- */}
          There are no articles in the ‘{category.title}’ category yet.
        </p>
      )}

      {/* Pagination Controls */}
      {totalArticles > ARTICLES_PER_PAGE && (
        <nav aria-label={`${category.title} articles pagination`} className="flex justify-center items-center space-x-3 sm:space-x-4 mt-10 mb-4">
          {currentPage > 1 ? (
            <Link 
              href={currentPage === 2 ? `/categories/${categorySlug}` : `/categories/${categorySlug}?page=${currentPage - 1}`} 
              className={secondaryButtonStyle}
            >
              ← Previous
            </Link>
          ) : (
            <span className={disabledButtonStyle}>← Previous</span>
          )}

          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={`/categories/${categorySlug}?page=${currentPage + 1}`} className={secondaryButtonStyle}>
              Next →
            </Link>
          ) : (
            <span className={disabledButtonStyle}>Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await client.fetch(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`);
  return categories.map((category) => ({
    slug: category.slug,
  }));
}