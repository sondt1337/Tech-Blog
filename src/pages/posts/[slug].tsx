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

interface PostProps {
  post: {
    title: string;
    date: string;
    content: string;
  }
}

export default function Post({ post }: PostProps) {
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
        <div className="mb-12 ">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block dark:text-blue-400 dark:hover:text-blue-600">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
          <time className="text-gray-500 dark:text-gray-100 text-sm">
            {new Date(post.date).toLocaleDateString('en-US', {
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

        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">Share this post</h3>
          <div className="flex space-x-4 dark:text-gray-100">
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">Twitter</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">LinkedIn</a>
          </div>
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