'use client'

import { useState, useCallback } from 'react'
import { sections } from '@/data/sections'
import Link from 'next/link'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof sections>([])
  const [open, setOpen] = useState(false)

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)

      if (value.length > 0) {
        const filtered = sections.filter(
          (section) =>
            section.title.toLowerCase().includes(value.toLowerCase()) ||
            section.description.toLowerCase().includes(value.toLowerCase())
        )
        setResults(filtered)
        setOpen(true)
      } else {
        setResults([])
        setOpen(false)
      }
    },
    []
  )

  return (
    <div className="relative hidden md:block w-96">
      <input
        type="text"
        placeholder="Search sections, topics..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query && setOpen(true)}
        className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-dark-700 border border-slate-300 dark:border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
      />

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-slate-200 dark:border-dark-700 z-50">
          {results.map((section) => (
            <Link
              key={section.id}
              href={`/section/${section.slug}`}
              className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-dark-700 border-b last:border-b-0"
              onClick={() => {
                setQuery('')
                setResults([])
                setOpen(false)
              }}
            >
              <div className="font-semibold text-sm">
                {section.emoji} {section.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                {section.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
