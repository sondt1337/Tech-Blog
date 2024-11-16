import Layout from '@/layouts/Layout'
import { getPage, getAllPages } from '@/lib/markdown'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkEmoji from 'remark-emoji';


interface PageProps {
  page: {
    title: string
    lastUpdated: string
    content: string
  }
}

export default function Page({ page }: PageProps) {
  const content = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkEmoji)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(page.content)
    .toString()

  return (
    <Layout title={page.title}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(page.lastUpdated).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const pages = getAllPages()
  return {
    paths: pages.map((page) => ({
      params: { slug: page.slug }
    })),
    fallback: false
  }
}

export async function getStaticProps({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const page = getPage(params.slug)
  
  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: { page }
  }
}