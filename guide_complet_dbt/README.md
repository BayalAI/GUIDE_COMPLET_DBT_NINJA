# DBT Ninja Guide - Complete Learning Platform

> **Professional Documentation Platform for Learning dbt from Junior to Ninja Level**

## 🚀 Project Overview

This is a modern, interactive web application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** that transforms the complete dbt guide into an engaging learning platform.

### ✨ Features

- **📚 Comprehensive Documentation**: 12 sections covering dbt from basics to production
- **🔍 Full-Text Search**: Quick access to any topic
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🌙 Dark Mode**: Built-in dark theme support
- **⚡ Fast & Optimized**: Next.js static generation for maximum performance
- **🎨 Beautiful UI**: Modern design with Tailwind CSS
- **📖 Table of Contents**: Auto-generated for each section
- **🔗 Smart Navigation**: Previous/Next section links

## 📦 Tech Stack

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS 3, PostCSS
- **Language**: TypeScript 5
- **Deployment**: Vercel
- **Package Manager**: npm/pnpm

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Format code
npm run format
```

## 📁 Project Structure

```
dbt-ninja-guide/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── section/
│   │   │   └── [slug]/      # Dynamic section pages
│   │   └── MainLayout.tsx   # Main layout wrapper
│   ├── components/          # Reusable components
│   │   ├── Navigation.tsx   # Sidebar navigation
│   │   ├── SearchBox.tsx    # Search functionality
│   │   ├── TableOfContents.tsx
│   │   ├── CodeBlock.tsx
│   │   └── Card.tsx
│   ├── data/
│   │   └── sections.ts      # Content data structure
│   └── globals.css          # Global styles
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

## 📖 Content Structure

The guide is organized into 12 progressive sections:

1. **🎨 Architecture Complète** - The medallion architecture (Bronze, Silver, Gold)
2. **⚙️ Installation** - Step-by-step setup guide
3. **⚙️ Configuration** - dbt_project.yml and profiles.yml
4. **🧹 Models - Bronze** - Data cleaning and staging
5. **🔗 Models - Silver** - Business logic and transformations
6. **✨ Models - Gold** - BI-ready dimensions and facts
7. **✅ Tests & Quality** - Data validation strategies
8. **⚙️ Macros & Jinja** - Reusable SQL templates
9. **📸 Snapshots & SCD** - Historical tracking
10. **🌱 Seeds & Data** - CSV data loading
11. **⚙️ Workflows** - Development and production pipelines
12. **🥋 Tips & Tricks** - Best practices and ninja techniques

## 🚀 Deployment to Vercel

### Option 1: Git Integration (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel will automatically deploy on push
```

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 3: Manual Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Configure project settings
5. Click "Deploy"

## 🔧 Environment Variables

No environment variables required for basic deployment.

For analytics (optional):

```bash
# .env.local
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📊 Performance Optimizations

- ✅ Static generation for all pages
- ✅ Image optimization
- ✅ Code splitting
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ SEO optimization

## 🎯 SEO & Metadata

All pages include:
- Proper meta tags
- Open Graph support
- Structured data
- Sitemap generation
- Robots.txt configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning and teaching purposes.

## 🔗 Resources

- [Official dbt Documentation](https://docs.getdbt.com/)
- [dbt Community Discourse](https://discourse.getdbt.com/)
- [GitHub dbt-core](https://github.com/dbt-labs/dbt-core)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💡 Tips for Using This Guide

1. **Start with Architecture** - Understand the medallion pattern first
2. **Follow the Order** - Each section builds on previous concepts
3. **Copy Code Examples** - All code is copy-paste ready
4. **Use Search** - Quick lookup for specific topics
5. **Practice** - Set up a dbt project locally while reading

## 🐛 Bug Reports & Feature Requests

Found an issue or have an idea? Open an issue on GitHub!

## 🙏 Acknowledgments

- dbt Labs for creating this amazing tool
- The dbt community for inspiration
- All contributors and educators

---

**Built with ❤️ for Data Engineers** 

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
