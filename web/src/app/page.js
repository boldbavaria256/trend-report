import { client, urlFor } from '@/sanity/client';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';

const ARTICLES_PER_PAGE = 12;

async function getHomepageSettings() {
  const query = `*[_type == "homepageSettings" && _id == "homepageSettings"][0] {
    _id,
    title,
    heroArticle->{
      _id,
      title,
      "slug": slug.current,
      mainImage {
        asset->{_id, url, metadata {dimensions}},
        alt
      },
      excerpt,
      publishedAt,
      categories[]->{
        _id,
        title,
        "slug": slug.current
      }
    }
  }`;
  return await client.fetch(query);
}

async function getPaginatedArticles(page = 1) {
  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
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
    categories[]->{
        _id,
        title
    }
  }`;

  const totalCountQuery = `count(*[_type == "article"])`;

  const [articles, totalArticles] = await Promise.all([
    client.fetch(articlesQuery),
    client.fetch(totalCountQuery)
  ]);

  return { articles, totalArticles };
}

export default async function HomePage({ searchParams }) {
  const currentPage = parseInt(searchParams?.page) || 1;

  const [settings, { articles: paginatedArticles, totalArticles }] = await Promise.all([
    getHomepageSettings(),
    getPaginatedArticles(currentPage)
  ]);

  const heroArticle = settings?.heroArticle;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {heroArticle && (
        <section className="relative w-full h-[85dvh] min-h-[600px] flex items-center justify-start overflow-hidden">
          {/* Background Image with Neutral Depth Overlay */}
          <div className="absolute inset-0 z-0">
            {heroArticle.mainImage?.asset && (
              <Image
                src={urlFor(heroArticle.mainImage).width(1920).height(1080).fit('crop').url()}
                alt={heroArticle.mainImage.alt || heroArticle.title}
                fill
                priority
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-black/40 lg:bg-transparent" />
          </div>

          {/* Floating Hero Content Card */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl glass p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3rem] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] md:leading-[1.05] text-balance">
                {heroArticle.title}
              </h1>

              <div className="pt-4">
                <Link
                  href={`/articles/${heroArticle.slug}`}
                  className="inline-flex items-center px-10 py-5 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95"
                >
                  Read Full Story
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Latest Stories</h2>
          <div className="h-px flex-grow bg-border ml-8 hidden sm:block"></div>
        </div>

        {paginatedArticles?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No articles found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-2">
            <Link
              href={currentPage > 2 ? `/?page=${currentPage - 1}` : '/'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                ? 'text-muted-foreground cursor-not-allowed'
                : 'hover:bg-muted text-foreground'
                }`}
              aria-disabled={currentPage === 1}
            >
              Previous
            </Link>

            <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Link
              href={`/?page=${currentPage + 1}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPage >= totalPages
                ? 'text-muted-foreground cursor-not-allowed'
                : 'hover:bg-muted text-foreground'
                }`}
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}