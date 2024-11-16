import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content')
const pagesDirectory = path.join(process.cwd(), 'content', 'pages')

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => {
      return fileName.endsWith('.md') && !fs.statSync(path.join(postsDirectory, fileName)).isDirectory()
    })
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug: fileName.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        featured: data.featured || null,
        content
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      featured: data.featured || null,
      content
    }
  } catch (error) {
    return null
  }
}

export function getAllPages() {
  try {
    const fileNames = fs.readdirSync(pagesDirectory)
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => ({
        slug: fileName.replace(/\.md$/, '')
      }))
  } catch (error) {
    return []
  }
}


export function getPage(slug: string) {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      lastUpdated: data.lastUpdated,
      content
    }
  } catch (error) {
    return null
  }
}