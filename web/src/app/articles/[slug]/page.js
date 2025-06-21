// web/src/app/articles/[slug]/page.js

import { client, urlFor } from '@/sanity/client';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard'; // For related articles

// --- DATA FETCHING FUNCTION (getArticle and Related Articles) ---
async function getArticleAndRelated(slug, maxRelated = 3) {
  const mainArticleQuery = `*[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "currentSlug": slug.current,
    mainImage {
      asset->{_id, url, metadata {dimensions}},
      alt
    },
    publishedAt,
    body,
    "categoryIds": categories[]._ref 
  }`;

  try {
    const article = await client.fetch(mainArticleQuery, { slug });

    if (!article) {
      return { article: null, relatedArticles: [] };
    }

    let relatedArticles = [];
    // Fetch full category details for the main article's display
    const mainArticleCategoryDetailsQuery = `*[_type == "article" && slug.current == $slug][0] {
      categories[]->{_id, title, "slug": slug.current}
    }`;
    const mainArticleWithCategories = await client.fetch(mainArticleCategoryDetailsQuery, { slug });
    article.categories = mainArticleWithCategories?.categories || [];


    if (article.categoryIds && article.categoryIds.length > 0) {
      const relatedArticlesQuery = `
        *[_type == "article" && slug.current != $currentSlug && count((categories[]->_ref)[@ in $categoryIds]) > 0]
        | order(count((categories[]->_ref)[@ in $categoryIds]) desc, publishedAt desc) [0...${maxRelated}] {
          _id,
          title,
          "slug": slug.current,
          mainImage {
            asset->{_id, url, metadata {dimensions}},
            alt
          },
          excerpt,
          publishedAt
        }
      `;
      relatedArticles = await client.fetch(relatedArticlesQuery, {
        currentSlug: slug,
        categoryIds: article.categoryIds,
      });
    }
    
    return { article, relatedArticles: relatedArticles || [] };

  } catch (error) {
    console.error(`Error fetching article and related for slug "${slug}":`, error);
    return { article: null, relatedArticles: [] };
  }
}


// --- PORTABLE TEXT COMPONENTS ---
const portableTextComponents = {
  types: { 
    image: ({ value }) => { 
      if (!value?.asset?._ref && !value?.asset?._id) return null;
      return (
        <figure className="my-6 md:my-8">
          <div className="relative aspect-video">
            <Image
              src={urlFor(value).fit('max').auto('format').url()}
              alt={value.alt || 'Article content image'}
              fill 
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
          {value.caption && (<figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{value.caption}</figcaption>)}
        </figure>
      );
    },
  },
  marks: { 
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (<Link href={value.href} rel={rel} className="text-blue-600 hover:underline dark:text-blue-400">{children}</Link>);
    },
  },
  block: { 
    h2: ({ children }) => <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-4 md:mt-10 md:mb-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl sm:text-2xl font-semibold mt-7 mb-3 md:mt-8 md:mb-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg sm:text-xl font-semibold mt-6 mb-3 md:mt-7 md:mb-4">{children}</h4>,
    blockquote: ({ children }) => (<blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 pr-2 py-3 italic my-6 md:my-8 text-gray-700 dark:text-gray-300 rounded-r-md">{children}</blockquote>),
    normal: ({ children }) => <p className="mb-5 md:mb-6 leading-relaxed">{children}</p>,
  },
  list: { 
    bullet: ({ children }) => <ul className="list-disc pl-6 md:pl-8 my-5 md:my-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 md:pl-8 my-5 md:my-6 space-y-2">{children}</ol>, // <--- CORRECTED TAG
  },
  listItem: { 
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

// --- PAGE COMPONENT ---
export default async function ArticlePage({ params }) {
  const { article, relatedArticles } = await getArticleAndRelated(params.slug, 3);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <article className="max-w-3xl mx-auto">
        
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight text-slate-900 dark:text-white">
            {article.title}
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mt-4">
            {article.publishedAt && (
              <p>
                {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                  month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </p>
            )}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                {article.categories.map((category) => (
                  <Link 
                    key={category._id} 
                    href={`/categories/${category.slug}`} 
                    className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {article.mainImage && article.mainImage.asset && (
          <div className="my-6 md:my-8 relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
             <Image 
              src={urlFor(article.mainImage).width(1000).fit('crop').auto('format').url()} 
              alt={article.mainImage.alt || article.title || 'Article main image'} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>
        )}

        {article.body ? (
          <div className="prose prose-lg dark:prose-invert max-w-none py-4 md:py-6 text-gray-800 dark:text-gray-200 leading-relaxed">
            <PortableText value={article.body} components={portableTextComponents} />
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">Article content not found.</p>
        )}
      </article>

      {/* --- RELATED ARTICLES SECTION --- */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section aria-labelledby="related-articles-heading" className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-700">
          <h2 id="related-articles-heading" className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center md:text-left">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle._id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// --- GENERATE STATIC PARAMS ---
export async function generateStaticParams() {
  const query = `*[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
  let articles = [];
  try {
    articles = await client.fetch(query);
    if (!Array.isArray(articles)) {
      console.error("generateStaticParams: Sanity did not return an array for articles", articles);
      return [];
    }
  } catch (error) {
    console.error("Error fetching articles for generateStaticParams:", error);
    return [];
  }
  
  return articles
    .filter(article => article && typeof article.slug === 'string')
    .map((article) => ({
      slug: article.slug,
    }));
}

// --- REVALIDATE (OPTIONAL) ---
export const revalidate = 3600; // Revalidate every hour