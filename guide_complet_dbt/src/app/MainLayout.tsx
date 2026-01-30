'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBox from '@/components/SearchBox'
import Navigation from '@/components/Navigation'

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(true)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-700">
        <div className="container-custom flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-primary-600"
          >
            <span className="text-2xl">🥋</span>
            <span>DBT Ninja</span>
          </Link>

          <SearchBox />

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary lg:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-64 bg-slate-50 dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 overflow-y-auto`}
        >
          <Navigation />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">{children}</div>
        </main>
      </div>
    </>
  )
}
