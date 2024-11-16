import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/lib/markdown';
import { POSTS_PER_PAGE } from '../index';
import Home, { HomeProps } from '../index';

const PageComponent = ({ posts, currentPage, totalPages }: HomeProps) => {
  return (
    <Home 
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const currentPage = Number(params?.page) || 1;
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  if (currentPage < 1 || currentPage > totalPages) {
    return {
      notFound: true,
    };
  }

  if (currentPage === 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    props: {
      posts: paginatedPosts.map((post) => ({
        slug: post.slug,
        title: post.title || null,
        date: post.date || null,
        excerpt: post.excerpt || null,
        featured: post.featured || null,
      })),
      currentPage,
      totalPages,
    },
  };
};

export default PageComponent;