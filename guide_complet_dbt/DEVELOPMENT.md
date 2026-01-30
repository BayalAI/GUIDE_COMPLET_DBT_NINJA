# 👨‍💻 Development Guide

## Getting Started Locally

### Installation

```bash
# Clone repository (if from GitHub)
git clone https://github.com/YOUR_USERNAME/dbt-ninja-guide.git
cd dbt-ninja-guide

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Development Workflow

### File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Home page
│   ├── MainLayout.tsx          # Main layout wrapper with sidebar
│   ├── globals.css             # Global CSS
│   └── section/
│       └── [slug]/
│           ├── page.tsx        # Dynamic section pages
│           └── layout.tsx      # Section layout
│
├── components/
│   ├── Navigation.tsx          # Sidebar navigation
│   ├── SearchBox.tsx           # Search functionality
│   ├── TableOfContents.tsx     # TOC component
│   ├── CodeBlock.tsx           # Code highlighting
│   └── Card.tsx                # Reusable card component
│
└── data/
    └── sections.ts             # Content data structure
```

### Adding New Sections

1. **Add to sections data** (`src/data/sections.ts`):

```typescript
{
    id: 13,
    title: 'Your New Section',
    slug: 'your-slug',
    emoji: '📝',
    description: 'Brief description',
    content: `
# Your Section Title

## Your Subsection

Your markdown content here...
    `
}
```

2. **The page auto-generates** - No additional files needed!

### Markdown Support

The content uses **simplified markdown**:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**

- List item 1
- List item 2

\`\`\`bash
code block
\`\`\`
```

### Styling Components

All components use **Tailwind CSS** classes:

```typescript
<div className="bg-white dark:bg-dark-800 text-slate-900 dark:text-white">
  Styled content
</div>
```

Available utilities:
- Colors: `primary`, `slate`, `dark`
- Spacing: `p-4`, `m-4`, `gap-4`
- Responsive: `md:grid-cols-2`, `lg:block`
- Dark mode: `dark:bg-dark-800`

## Commands

```bash
# Development
npm run dev                    # Start dev server (port 3000)

# Building
npm run build                 # Build for production
npm run type-check           # Check TypeScript errors
npm run lint                 # Run ESLint

# Formatting
npm run format               # Format code with Prettier

# Production
npm start                    # Start production server
```

## Hot Reload

Changes auto-reload in browser:
- ✅ React components
- ✅ CSS files
- ✅ Content data
- ✅ TypeScript files

## Debugging

### View Source Code

```bash
# Terminal
npm run dev
```

Then in browser:
- Right-click → Inspect
- Network tab to see requests
- Console tab for errors

### Debug Mode

```typescript
// Add to any component
console.log('Debug:', variable)
```

## Common Tasks

### Update Homepage

Edit `src/app/page.tsx`

### Change Styling

Edit:
- `src/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind config
- Component `className` attributes

### Add New Component

```typescript
// src/components/MyComponent.tsx

interface MyComponentProps {
  title: string
  children: ReactNode
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}
```

### Update Navigation

Edit `src/components/Navigation.tsx`

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    600: '#your-color',
  }
}
```

## Performance Tips

1. **Use Next.js Image** for images:

```typescript
import Image from 'next/image'
<Image src="/image.png" alt="" width={100} height={100} />
```

2. **Lazy load components**:

```typescript
import dynamic from 'next/dynamic'
const Component = dynamic(() => import('@/components/Component'))
```

3. **Optimize bundle**:

```bash
npm run build  # Shows bundle size
```

## Testing

### Manual Testing

```bash
npm run dev

# Test in browser:
# - Homepage loads
# - Navigation works
# - Sections render properly
# - Search works
# - Mobile responsive
```

### Browser DevTools

Use Chrome DevTools for:
- Performance analysis
- Responsive design testing
- Console error checking

## Best Practices

✅ **Use TypeScript** for type safety
✅ **Use Tailwind** for consistent styling
✅ **Keep components small** and reusable
✅ **Comment complex logic**
✅ **Test before committing**

## Troubleshooting

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### TypeScript errors

```bash
npm run type-check
# Fix errors shown
```

### Styling not applying

```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

### Import errors

Ensure imports use `@/` alias:

```typescript
// ✅ Good
import Navigation from '@/components/Navigation'

// ❌ Bad
import Navigation from '../../../components/Navigation'
```

## Code Quality

```bash
# Check all
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run format      # Prettier

# Or one command
npm run type-check && npm run lint && npm run format
```

## Version Control

```bash
# See changes
git status

# Stage changes
git add .

# Commit
git commit -m "Descriptive message"

# Push
git push origin main
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

Happy coding! 🚀
