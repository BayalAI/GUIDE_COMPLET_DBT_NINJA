'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sections } from '@/data/sections'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="p-6 space-y-4">
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
          📚 Guide Complet
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`block px-3 py-2 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700'
              }`}
            >
              🏠 Home
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
          📖 Sections
        </h3>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`/section/${section.slug}`}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  pathname === `/section/${section.slug}`
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700'
                }`}
              >
                {section.emoji} {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-divider"></div>

      <div>
        <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
          🔗 Resources
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://docs.getdbt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              → Official dbt Docs
            </a>
          </li>
          <li>
            <a
              href="https://github.com/dbt-labs/dbt-core"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              → GitHub dbt-core
            </a>
          </li>
          <li>
            <a
              href="https://discourse.getdbt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              → dbt Discourse
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
