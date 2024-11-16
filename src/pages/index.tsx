import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import Layout from '@/layouts/Layout';

export const POSTS_PER_PAGE = 4;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-4 mt-8">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? '/' : `/page/${currentPage - 1}`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Previous Page
        </Link>
      )}
      
      <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
        Page {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={`/page/${currentPage + 1}`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Next Page
        </Link>
      )}
    </div>
  );
}

export default function Home({ posts, currentPage, totalPages }: HomeProps) {
  return (
    <Layout title="Home">
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Welcome to sondt&apos;s Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-100">
            Something about infosec!...
          </p>
        </section>

        <section className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <Link href={`/posts/${post.slug}`}>
                {post.featured && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={post.featured}
                      alt={post.title || 'Featured image'}
                      className="object-cover w-full h-full transform hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="mb-4">
                    <time className="text-sm text-gray-500 dark:text-gray-100">
                      {post.date ? new Date(post.date).toLocaleDateString('en-EN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : 'No date'}
                    </time>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-100 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                      Read more→
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </Layout>
  );
}

export interface HomeProps {
  posts: {
    slug: string;
    title: string | null;
    date: string | null;
    excerpt: string | null;
    featured: string | null;
  }[];
  currentPage: number;
  totalPages: number;
}

export async function getStaticProps() {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = allPosts.slice(0, POSTS_PER_PAGE);

  return {
    props: {
      posts: paginatedPosts.map((post) => ({
        slug: post.slug,
        title: post.title || null,
        date: post.date || null,
        excerpt: post.excerpt || null,
        featured: post.featured || null,
      })),
      currentPage: 1,
      totalPages,
    },
  };
}