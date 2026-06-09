export type ElementType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'divider'
  | 'container'
  | 'row'
  | 'column'
  | 'grid'
  | 'spacer'

export interface ElementStyles {
  x?: number
  y?: number
  width?: number | string
  height?: number | string
  zIndex?: number
  padding?: string
  margin?: string
  background?: string
  color?: string
  borderRadius?: string
  fontSize?: string
  fontWeight?: string | number
  fontFamily?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  flexDirection?: 'row' | 'column'
  gap?: string
  alignItems?: string
  justifyContent?: string
}

interface BaseElement {
  id: string
  type: ElementType
  styles: ElementStyles
}

export interface TextElement extends BaseElement {
  type: 'text'
  props: { content: string }
}

export interface HeadingElement extends BaseElement {
  type: 'heading'
  props: { content: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
}

export interface ImageElement extends BaseElement {
  type: 'image'
  props: { src: string; alt: string }
}

export interface ButtonElement extends BaseElement {
  type: 'button'
  props: { label: string; href?: string }
}

export interface DividerElement extends BaseElement {
  type: 'divider'
  props: Record<string, never>
}

export interface SpacerElement extends BaseElement {
  type: 'spacer'
  props: Record<string, never>
}

export interface ContainerElement extends BaseElement {
  type: 'container'
  layoutMode: 'absolute' | 'flow'
  children: Element[]
}

export interface RowElement extends BaseElement {
  type: 'row'
  layoutMode: 'absolute' | 'flow'
  children: Element[]
}

export interface ColumnElement extends BaseElement {
  type: 'column'
  layoutMode: 'absolute' | 'flow'
  children: Element[]
}

export interface GridElement extends BaseElement {
  type: 'grid'
  layoutMode: 'absolute' | 'flow'
  children: Element[]
}

export type Element =
  | TextElement
  | HeadingElement
  | ImageElement
  | ButtonElement
  | DividerElement
  | SpacerElement
  | ContainerElement
  | RowElement
  | ColumnElement
  | GridElement

export type ContainerLike = ContainerElement | RowElement | ColumnElement | GridElement

export interface PageMeta {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
}

export interface Page {
  id: string
  title: string
  slug: string
  rootElement: ContainerElement
  meta: PageMeta
}

export interface GlobalStyles {
  fontPrimary: string
  fontSecondary: string
  colorPalette: Record<string, string>
  spacingScale: number[]
}

export interface SiteDocument {
  id: string
  name: string
  pages: Page[]
  globalStyles: GlobalStyles
  createdAt: string
  updatedAt: string
}
