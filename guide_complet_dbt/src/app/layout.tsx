import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '../globals.css'

export const metadata: Metadata = {
  title: 'DBT Ninja Guide - Complete Documentation Platform',
  description: 'Learn dbt from Junior to Ninja level with our comprehensive interactive guide. Architecture, SQL, tests, macros, and production workflows.',
  keywords: [
    'dbt',
    'data transformation',
    'sql',
    'analytics',
    'warehouse',
    'etl',
    'documentation',
  ],
  authors: [{ name: 'Data Engineering Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'DBT Ninja Guide',
    description: 'Complete dbt documentation platform from junior to ninja level',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-dark-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  )
}
