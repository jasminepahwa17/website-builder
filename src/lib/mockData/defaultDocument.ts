import type { SiteDocument, ContainerElement, HeadingElement, TextElement } from '@/types'

const heading: HeadingElement = {
  id: 'el-heading-1',
  type: 'heading',
  styles: {
    x: 80,
    y: 60,
    width: 640,
    height: 80,
    zIndex: 1,
    color: '#111827',
    fontFamily: 'inherit',
    fontWeight: '700',
    fontSize: '2.25rem',
  },
  props: {
    content: 'Welcome to My Site',
    level: 1,
  },
}

const body: TextElement = {
  id: 'el-text-1',
  type: 'text',
  styles: {
    x: 80,
    y: 160,
    width: 560,
    height: 48,
    zIndex: 1,
    color: '#6B7280',
    fontFamily: 'inherit',
    fontSize: '1rem',
  },
  props: {
    content: 'Edit this page to get started. Drag elements from the palette onto the canvas.',
  },
}

const rootElement: ContainerElement = {
  id: 'el-root-1',
  type: 'container',
  layoutMode: 'absolute',
  styles: {
    x: 0,
    y: 0,
    width: 1280,
    height: 900,
    background: '#FFFFFF',
    zIndex: 0,
  },
  children: [heading, body],
}

export const DEFAULT_DOCUMENT: SiteDocument = {
  id: 'doc-default',
  name: 'My Site',
  pages: [
    {
      id: 'page-home',
      title: 'Home',
      slug: '/',
      rootElement,
      meta: {
        title: 'Home — My Site',
        description: 'Welcome to my site.',
      },
    },
  ],
  globalStyles: {
    fontPrimary: 'Inter, sans-serif',
    fontSecondary: 'Georgia, serif',
    colorPalette: {
      brand: '#3B82F6',
      accent: '#F59E0B',
      neutral: '#6B7280',
      surface: '#FFFFFF',
      background: '#F9FAFB',
    },
    spacingScale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96],
  },
  createdAt: '2026-06-10T00:00:00.000Z',
  updatedAt: '2026-06-10T00:00:00.000Z',
}
