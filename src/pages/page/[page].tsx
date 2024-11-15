import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/lib/markdown';
import Home from '../index';
import { POSTS_PER_PAGE } from '../index';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const currentPage = Number(params?.page) || 1;
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  // Kiểm tra trang hợp lệ
  if (currentPage < 1 || currentPage > totalPages) {
    return {
      notFound: true,
    };
  }

  // Chuyển hướng về trang chủ nếu là trang 1
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
      })),
      currentPage,
      totalPages,
    },
  };
};

export default Home;