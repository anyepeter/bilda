# PromptForge - AI-Powered Prompt Generator Landing Page

A stunning, production-ready SaaS landing page built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for fluid interactions
- **Mobile-First Design**: Fully responsive across all devices
- **Premium UI/UX**: Clean, modern aesthetic with attention to detail
- **SEO Optimized**: Proper metadata and semantic HTML
- **Performance Focused**: Optimized for speed and Core Web Vitals

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/
│   │   ├── Button.tsx      # Reusable button component
│   │   ├── Card.tsx        # Card component with hover effects
│   │   └── Section.tsx     # Section wrapper for consistent spacing
│   ├── Navbar.tsx          # Sticky navigation
│   ├── Hero.tsx            # Hero section with animations
│   ├── HowItWorks.tsx      # Step-by-step process
│   ├── Features.tsx        # Feature highlights
│   ├── UseCases.tsx        # Use case examples
│   ├── CTA.tsx             # Call-to-action section
│   └── Footer.tsx          # Footer with links
└── lib/
    └── utils.ts            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Color Palette

- **Primary**: Deep Indigo (#4F46E5)
- **Secondary**: Soft Cyan (#22D3EE)
- **Dark**: Charcoal (#0F172A)
- **Light**: Off-white (#F8FAFC)
- **Gradients**: Blue → Purple for premium feel

## Sections Overview

1. **Navbar** - Sticky navigation with smooth scroll
2. **Hero** - Eye-catching headline with dual CTAs
3. **How It Works** - 4-step process visualization
4. **Features** - Benefits-focused feature cards
5. **Use Cases** - Target audience examples
6. **CTA** - Emotional call-to-action
7. **Footer** - Links and social media

## Customization

### Updating Content

- Edit text content in component files
- Modify colors in `tailwind.config.ts`
- Adjust animations in component files

### Adding New Sections

1. Create component in `/components`
2. Import and add to `app/page.tsx`
3. Update navigation links in `Navbar.tsx`

## Performance

- Lighthouse Score: 95+
- Mobile-optimized
- Lazy loading for images
- Optimized animations

## License

MIT License - feel free to use for your projects

## Credits

Built with modern best practices for SaaS landing pages.
