import { getAllPosts, getPostBySlug } from '@/lib/markdown'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import Layout from '@/layouts/Layout'
import Link from 'next/link'
import { useEffect } from 'react'

interface PostProps {
  post: {
    title: string;
    date: string;
    content: string;
  }
}

export default function Post({ post }: PostProps) {
  // Thêm function xử lý copy
  const copyToClipboard = async (text: string, buttonElement: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      buttonElement.textContent = 'Copied!';
      setTimeout(() => {
        buttonElement.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      // Thêm class group để control copy button visibility
      pre.classList.add('group', 'relative');
      
      // Xác định ngôn ngữ từ class
      const codeElement = pre.querySelector('code');
      const language = codeElement?.className.match(/language-(\w+)/)?.[1] || 'text';
      
      // Thêm language badge
      // const languageBadge = document.createElement('span');
      // languageBadge.textContent = language;
      // languageBadge.className = 'language-badge';
      // pre.appendChild(languageBadge);
  
      // Thêm copy button với style mới
      if (!pre.querySelector('.copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        const code = pre.textContent || '';
        copyButton.addEventListener('click', () => copyToClipboard(code, copyButton));
        pre.appendChild(copyButton);
      }
    });
  
    return () => {
      const copyButtons = document.querySelectorAll('.copy-button');
      const languageBadges = document.querySelectorAll('.language-badge');
      copyButtons.forEach(button => button.remove());
      languageBadges.forEach(badge => badge.remove());
    };
  }, []);

  const content = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(post.content)
    .toString()

  return (
    <Layout title={post.title}>
      <article className="max-w-4xl mx-auto dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block dark:text-blue-400 dark:hover:text-blue-600">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
          <time className="text-gray-500 dark:text-gray-100 text-sm">
            {new Date(post.date).toLocaleDateString('en-EN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <div className="prose prose-lg prose-blue mx-auto bg-white rounded-xl shadow-md p-8 
                dark:bg-gray-900 dark:text-gray-200 dark:shadow-lg dark:border dark:border-gray-700">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug }
    })),
    fallback: false
  }
}

export async function getStaticProps({ 
  params 
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  return {
    props: { post }
  }
}