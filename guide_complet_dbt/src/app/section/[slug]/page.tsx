'use client'

import { ReactElement } from 'react'
import MainLayout from '@/app/MainLayout'
import Card from '@/components/Card'
import TableOfContents from '@/components/TableOfContents'
import { sections } from '@/data/sections'
import Link from 'next/link'

interface SectionPageProps {
  params: {
    slug: string
  }
}

// Fonction pour parser le markdown simplifié
function parseMarkdown(content: string): ReactElement {
  const lines = content.split('\n')
  const elements: ReactElement[] = []
  let codeBlock: string[] = []
  let inCode = false
  let codeLanguage = 'bash'

  const tableOfContents: Array<{
    id: string
    title: string
    level: 1 | 2 | 3
  }> = []

  lines.forEach((line, index) => {
    // Gestion des blocs de code
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <div
            key={`code-${index}`}
            className="code-block my-4 rounded-lg overflow-hidden"
          >
            <div className="bg-slate-800 dark:bg-dark-900 px-4 py-2 text-xs font-mono text-slate-400">
              {codeLanguage}
            </div>
            <pre className="bg-slate-900 dark:bg-dark-900 p-4 overflow-x-auto">
              <code className="text-slate-100 text-sm font-mono">
                {codeBlock.join('\n')}
              </code>
            </pre>
          </div>
        )
        codeBlock = []
        inCode = false
      } else {
        inCode = true
        codeLanguage = line.slice(3).trim() || 'bash'
      }
      return
    }

    if (inCode) {
      codeBlock.push(line)
      return
    }

    // Gestion des headings
    if (line.startsWith('# ')) {
      const id = line.replace(/# /, '').toLowerCase().replace(/\s+/g, '-')
      tableOfContents.push({ id, title: line.replace(/# /, ''), level: 1 })
      elements.push(
        <h1
          key={`h1-${index}`}
          id={id}
          className="text-4xl font-bold my-6 scroll-mt-20"
        >
          {line.replace(/# /, '')}
        </h1>
      )
    } else if (line.startsWith('## ')) {
      const id = line.replace(/## /, '').toLowerCase().replace(/\s+/g, '-')
      tableOfContents.push({ id, title: line.replace(/## /, ''), level: 2 })
      elements.push(
        <h2
          key={`h2-${index}`}
          id={id}
          className="text-3xl font-bold my-6 scroll-mt-20"
        >
          {line.replace(/## /, '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      const id = line.replace(/### /, '').toLowerCase().replace(/\s+/g, '-')
      tableOfContents.push({ id, title: line.replace(/### /, ''), level: 3 })
      elements.push(
        <h3
          key={`h3-${index}`}
          id={id}
          className="text-2xl font-bold my-5 scroll-mt-20"
        >
          {line.replace(/### /, '')}
        </h3>
      )
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${index}`} className="text-xl font-bold my-4">
          {line.replace(/#### /, '')}
        </h4>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4">
          {lines
            .slice(index)
            .takeWhile((l) => l.startsWith('- ') || l.startsWith('  '))
            .map((l, i) => (
              <li key={`li-${i}`} className="ml-4">
                {l.replace(/^- /, '').replace(/^  /, '')}
              </li>
            ))}
        </ul>
      )
    } else if (line.startsWith('**') || line.includes('**')) {
      elements.push(
        <p
          key={`p-${index}`}
          className="my-3 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: line.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-semibold">$1</strong>'
            ),
          }}
        />
      )
    } else if (line.trim()) {
      elements.push(
        <p key={`p-${index}`} className="my-3 leading-relaxed">
          {line}
        </p>
      )
    }
  })

  return (
    <>
      <TableOfContents items={tableOfContents} />
      {elements}
    </>
  )
}

export default function SectionPage({ params }: SectionPageProps) {
  const section = sections.find((s) => s.slug === params.slug)

  if (!section) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Section Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The section you're looking for doesn't exist.
          </p>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </MainLayout>
    )
  }

  // Trouver la section suivante
  const currentIndex = sections.findIndex((s) => s.slug === params.slug)
  const nextSection = sections[currentIndex + 1]
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-5xl mb-4">{section.emoji}</div>
          <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            {section.description}
          </p>
        </div>

        <div className="section-divider"></div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          {parseMarkdown(section.content)}
        </div>

        <div className="section-divider"></div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          {prevSection ? (
            <Link
              href={`/section/${prevSection.slug}`}
              className="btn btn-secondary"
            >
              ← {prevSection.title}
            </Link>
          ) : (
            <div></div>
          )}

          {nextSection && (
            <Link
              href={`/section/${nextSection.slug}`}
              className="btn btn-primary"
            >
              {nextSection.title} →
            </Link>
          )}
        </div>

        {/* Related Sections */}
        {nextSection && (
          <div className="section-divider"></div>
        )}

        {nextSection && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Next Section</h3>
            <Link
              href={`/section/${nextSection.slug}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{nextSection.emoji}</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{nextSection.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {nextSection.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </article>
    </MainLayout>
  )
}

// Polyfill for takeWhile
Array.prototype.takeWhile = function (callback) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i])
    } else {
      break
    }
  }
  return result
}
