// web/src/app/page.js

import { client, urlFor } from '@/sanity/client';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard'; // Ensure this component is created and styled

// --- CONFIGURATION ---
const ARTICLES_PER_PAGE = 20; // Number of articles to display per page in the "Latest Articles" list

// --- DATA FETCHING FUNCTIONS ---

async function getHomepageSettings() {
  const query = `*[_type == "homepageSettings" && _id == "homepageSettings"][0] {
    _id,
    title,
    heroArticle->{ // Expand the heroArticle reference
      _id,
      title,
      "slug": slug.current,
      mainImage {
        asset->{_id, url, metadata {dimensions}},
        alt
      },
      excerpt,
      publishedAt,
      categories[]->{ // Expand categories for the hero article
        _id,
        title,
        "slug": slug.current
      }
    }
  }`;
  const settings = await client.fetch(query);
  return settings;
}

async function getPaginatedArticles(page = 1) {
  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  // Sanity's slicing is exclusive for the end index, so to get ARTICLES_PER_PAGE items:
  // e.g., page 1: [0...20] gives items 0-19. page 2: [20...40] gives items 20-39.
  const endIndex = startIndex + ARTICLES_PER_PAGE; 

  const articlesQuery = `*[_type == "article"] | order(publishedAt desc) [${startIndex}...${endIndex}] {
    _id,
    title,
    "slug": slug.current,
    mainImage {
      asset->{_id, url, metadata {dimensions}},
      alt
    },
    excerpt,
    publishedAt,
    categories[]->{ // Expand categories for each article in the list
        _id,
        title
    }
  }`;

  const totalCountQuery = `count(*[_type == "article"])`;

  // Fetch articles for the current page and the total count in parallel
  const [articles, totalArticles] = await Promise.all([
    client.fetch(articlesQuery),
    client.fetch(totalCountQuery)
  ]);
  
  return { articles, totalArticles };
}

// --- PAGE COMPONENT ---
export default async function HomePage({ searchParams }) {
  // Determine the current page from URL search parameters, default to 1
  const currentPage = parseInt(searchParams?.page) || 1;

  // Fetch all necessary data in parallel
  const [settings, { articles: paginatedArticles, totalArticles }] = await Promise.all([
    getHomepageSettings(),
    getPaginatedArticles(currentPage)
  ]);

  const heroArticle = settings?.heroArticle;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  // Common button styling
  const buttonBaseStyle = "px-4 py-2 rounded-md transition-colors text-sm font-medium";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600`;
  const disabledButtonStyle = `${buttonBaseStyle} bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed`;


  return (
    // Main container for the page content
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-7xl space-y-12 md:space-y-16"> {/* Added space-y for vertical spacing between sections */}
        
        {/* Optional: Welcome Title */}
        {/* <h1 className="text-3xl md:text-4xl font-bold text-center">
          Welcome to The Trend Report!
        </h1> */}

        {/* Hero Article Section */}
        {heroArticle ? (
          <section aria-labelledby="hero-article-heading">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {/* Image Column */}
              {heroArticle.mainImage && heroArticle.mainImage.asset && (
                <div className="w-full md:w-2/5 lg:w-1/2 flex-shrink-0">
                  <Link href={`/articles/${heroArticle.slug}`} className="block aspect-[4/3] md:aspect-[16/9] relative w-full overflow-hidden rounded-md group">
                    <Image
                      src={urlFor(heroArticle.mainImage).width(800).fit('crop').auto('format').url()}
                      alt={heroArticle.mainImage.alt || heroArticle.title || 'Hero article image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />
                  </Link>
                </div>
              )}
              {/* Text Content Column */}
              <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col justify-center py-2"> {/* Added py-2 for some vertical padding */}
                <h2 id="hero-article-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  <Link href={`/articles/${heroArticle.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {heroArticle.title || 'Featured Article'}
                  </Link>
                </h2>
                
                {heroArticle.excerpt && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-base md:text-lg leading-relaxed"> {/* Added leading-relaxed */}
                    {heroArticle.excerpt}
                  </p>
                )}

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-1"> {/* Increased mb */}
                  {heroArticle.categories && heroArticle.categories.length > 0 && (
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {heroArticle.categories.map((category) => (
                        <Link key={category._id} href={`/categories/${category.slug}`} className="font-medium hover:underline">
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {heroArticle.publishedAt && (
                    <p>
                       {new Date(heroArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
                
                {heroArticle.slug && (
                  <Link href={`/articles/${heroArticle.slug}`} className={`${primaryButtonStyle} self-start md:self-auto max-w-xs text-center`}> {/* Applied primary button style, text-center for mobile */}
                    Read More
                  </Link>
                )}
              </div>
            </div>
          </section>
        ) : (
          // Placeholder if no hero article is selected
          <div className="text-center py-10 text-gray-500">
            <p>No featured article at the moment. Check out our latest articles below!</p>
          </div>
        )}

        {/* Paginated "Latest Articles" Section */}
        <section aria-labelledby="latest-articles-heading">
          <h2 id="latest-articles-heading" className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-b pb-3"> {/* Adjusted margins and padding */}
            Latest Articles 
            {totalArticles > 0 && <span className="text-base font-normal text-gray-500"> </span>}
          </h2>

          {paginatedArticles && paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8"> {/* Adjusted sm breakpoint and gaps */}
              {paginatedArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">
              {currentPage > 1 ? 'No more articles found for this page.' : 'No articles published yet. Check back soon!'}
            </p>
          )}

          {/* Pagination Controls */}
          {totalArticles > ARTICLES_PER_PAGE && (
            <nav aria-label="Article list pagination" className="flex justify-center items-center space-x-3 sm:space-x-4 mt-10 mb-12">
              {currentPage > 1 ? (
                <Link href={currentPage === 2 ? `/` : `/?page=${currentPage - 1}`} className={secondaryButtonStyle}>
                  ← Previous
                </Link>
              ) : (
                <span className={disabledButtonStyle}>← Previous</span>
              )}

              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link href={`/?page=${currentPage + 1}`} className={secondaryButtonStyle}>
                  Next →
                </Link>
              ) : (
                <span className={disabledButtonStyle}>Next →</span>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}