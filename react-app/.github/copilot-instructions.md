# React + Vite + Tailwind CSS Project Instructions

This is a fully configured React development environment with Vite and Tailwind CSS.

## Project Overview

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (ultra-fast frontend tooling)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **PostCSS**: Configured for autoprefixing and Tailwind processing

## Getting Started

### 1. Installation
All dependencies are installed. To add new packages:
```bash
npm install <package-name>
```

### 2. Development
Start the development server:
```bash
npm run dev
```
- Local: http://localhost:5173/
- HMR enabled for instant updates

### 3. Building
Create production build:
```bash
npm run build
```

## Key Configuration Files

- `tailwind.config.js` - Tailwind CSS settings
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `src/index.css` - Global styles with Tailwind directives

## File Structure

```
src/
  ├── App.tsx          - Main component (Tailwind example)
  ├── App.css          - App-specific styles
  ├── index.css        - Global styles
  ├── main.tsx         - React entry point
  └── assets/          - Static files
```

## Using Tailwind CSS

Use utility classes directly in your React components:

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click me
</button>
```

## Extending Tailwind

Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- And more!

## Tips

1. Keep components small and reusable
2. Use Tailwind utilities first before writing custom CSS
3. Extract repeated patterns into custom components
4. Hot Module Replacement (HMR) makes development fast
5. TypeScript provides type safety

## Troubleshooting

**Tailwind classes not working?**
- Ensure PostCSS configuration is correct
- Check that `src/index.css` has Tailwind directives
- Restart dev server

**Build issues?**
- Clear cache: `rm -rf dist` (or delete dist folder)
- Reinstall: `rm -rf node_modules && npm install`
- Check Node version: needs v18+
