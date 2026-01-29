import { ReactNode } from 'react'

interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

export default function CodeBlock({
  children,
  language = 'bash',
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const lines = children.trim().split('\n')

  return (
    <div className="code-block my-4">
      {title && (
        <div className="bg-slate-800 dark:bg-dark-900 px-4 py-2 text-sm font-mono text-slate-300 border-b border-slate-700">
          {title}
        </div>
      )}
      <pre className="bg-slate-900 dark:bg-dark-900 p-4 overflow-x-auto">
        <code className="text-slate-100 text-sm font-mono leading-relaxed">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="w-8 text-slate-600 mr-4 text-right flex-shrink-0 select-none">
                  {index + 1}
                </span>
              )}
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
