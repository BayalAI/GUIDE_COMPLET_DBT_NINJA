'use client'

import Link from 'next/link'
import MainLayout from '@/app/MainLayout'
import Card from '@/components/Card'

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-6xl">🥋</span> DBT Ninja Guide
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Complete Interactive Platform to Learn dbt from Junior to Ninja Level
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/section/architecture" className="btn btn-primary">
              Get Started →
            </Link>
            <a
              href="https://docs.getdbt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Official Docs
            </a>
          </div>
        </div>

        {/* Overview */}
        <div className="section-divider"></div>

        <section className="mb-12">
          <h2>📚 About This Guide</h2>
          <p className="text-lg mb-6">
            This comprehensive guide transforms the complete dbt documentation into an interactive learning platform. 
            It covers everything from basic architecture to production workflows with detailed explanations, 
            code examples, and best practices.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card title="🎨 Architecture" icon="🏗️" variant="tip">
              Understand the Bronze → Silver → Gold medallion architecture pattern
            </Card>
            <Card title="📝 Models" icon="📄" variant="tip">
              Learn to write SQL models with proper testing and documentation
            </Card>
            <Card title="⚙️ Configuration" icon="⚙️" variant="tip">
              Master dbt project setup, profiles, and configuration files
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card title="✅ Testing" icon="✔️" variant="success">
              Implement comprehensive data quality tests at every layer
            </Card>
            <Card title="🥋 Macros" icon="🔧" variant="success">
              Create reusable Jinja templates and custom tests
            </Card>
            <Card title="🚀 Production" icon="🚀" variant="success">
              Deploy and orchestrate dbt workflows in production
            </Card>
          </div>
        </section>

        {/* Key Features */}
        <div className="section-divider"></div>

        <section className="mb-12">
          <h2>✨ Key Features</h2>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Structured Learning</strong> - Progressive sections from basics to advanced
              </span>
            </li>
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Complete Code Examples</strong> - Copy-paste ready SQL, YAML, and PowerShell
              </span>
            </li>
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Explained Line-by-Line</strong> - Every concept with detailed comments
              </span>
            </li>
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Real-World Scenarios</strong> - Production-ready patterns and workflows
              </span>
            </li>
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Best Practices</strong> - Tested approaches from experienced engineers
              </span>
            </li>
            <li className="flex gap-3">
              <span>✅</span>
              <span>
                <strong>Search Functionality</strong> - Quickly find topics and examples
              </span>
            </li>
          </ul>
        </section>

        {/* Architecture Overview */}
        <div className="section-divider"></div>

        <section className="mb-12">
          <h2>🎨 The Medallion Architecture</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-800 dark:to-dark-700 rounded-lg p-8 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🧹</div>
                <h4 className="font-bold mb-2">Bronze</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Raw data cleaning, renaming, and typing
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <h4 className="font-bold mb-2">Silver</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Joins, business logic, and aggregations
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">✨</div>
                <h4 className="font-bold mb-2">Gold</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  BI-ready dimensions and facts
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-600 dark:text-slate-400">
            This layered approach ensures data quality, maintainability, and performance at scale
          </p>
        </section>

        {/* Call to Action */}
        <div className="section-divider"></div>

        <section className="bg-gradient-dark rounded-lg p-8 text-center text-white">
          <h2 className="text-white mb-4">Ready to Become a dbt Ninja? 🥋</h2>
          <p className="text-lg mb-6 text-slate-200">
            Start with the architecture section or pick any topic from the sidebar
          </p>
          <Link href="/section/architecture" className="btn bg-white text-primary-600 hover:bg-slate-100">
            Start Learning →
          </Link>
        </section>

        {/* Footer */}
        <div className="section-divider"></div>
        <footer className="text-center text-slate-600 dark:text-slate-400 py-8">
          <p>
            Built with ❤️ for Data Engineers • Powered by Next.js, Vercel, and dbt Community
          </p>
          <p className="text-sm mt-2">
            <a
              href="https://docs.getdbt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              Official dbt Documentation
            </a>
            {' • '}
            <a
              href="https://github.com/dbt-labs/dbt-core"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              GitHub
            </a>
            {' • '}
            <a
              href="https://discourse.getdbt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              Community Forum
            </a>
          </p>
        </footer>
      </div>
    </MainLayout>
  )
}
