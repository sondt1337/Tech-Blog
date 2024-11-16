# Tech Blog

A minimalist personal blog built with Next.js, Tailwind CSS, and Markdown.

## Features

- 🎨 Clean, minimalist design with Tailwind CSS
- 🌙 Dark/Light mode support
- ✍️ Write posts in Markdown
- 📝 Advanced Markdown features:
  - Code blocks with syntax highlighting
  - Math equations (KaTeX)
  - Emoji support
  - Footnotes
  - Tables
  - Task lists
- 📑 Automatic table of contents
- 🔍 SEO friendly
- 📱 Fully responsive

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sondt1337/Tech-Blog.git
cd Tech-Blog
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
Tech-Blog/
├── content/           # Markdown posts
│   └── pages/        # Static pages (about, etc.)
├── public/           # Static assets (images, etc.)
└── src/
    ├── components/   # React components
    ├── layouts/      # Layout components
    ├── lib/          # Utilities & helpers
    ├── pages/        # Next.js pages
    └── styles/       # CSS styles
```

## Writing Posts

1. Create a new `.md` file in the `content/` directory
2. Add frontmatter with the following format:
```yaml
---
title: "Your Post Title"
date: "YYYY-MM-DD"
excerpt: "A brief description of your post"
featured: "/images/featured.jpg"
---
```
3. Write your post content in Markdown

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Unified](https://unifiedjs.com/) - Markdown processing
- [KaTeX](https://katex.org/) - Math rendering
- [Prism](https://prismjs.com/) - Syntax highlighting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Author

- Thai Son Dinh ([@krixov](https://x.com/krixov))