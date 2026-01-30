import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DBT Documentation | Section',
}

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
