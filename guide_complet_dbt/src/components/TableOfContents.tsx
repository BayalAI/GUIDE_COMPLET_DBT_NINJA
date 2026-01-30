interface TableOfContentsProps {
  items: Array<{
    id: string
    title: string
    level: 1 | 2 | 3
  }>
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null

  return (
    <div className="card mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span>📑</span> On This Page
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: `${(item.level - 1) * 16}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
