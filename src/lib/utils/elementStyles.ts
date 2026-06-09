import type { ElementStyles } from '@/types'
import type { CSSProperties } from 'react'

// Position/size styles for SelectionWrapper — owns the element's visual bounds.
export function toWrapperStyle(
  styles: ElementStyles,
  parentLayoutMode: 'absolute' | 'flow' = 'absolute',
): CSSProperties {
  if (parentLayoutMode === 'absolute') {
    return {
      position: 'absolute',
      left: styles.x,
      top: styles.y,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex,
    }
  }
  return {
    width: styles.width,
    height: styles.height,
  }
}

// Content-only styles for element renderers — no position or size (wrapper owns those).
export function toContentStyle(styles: ElementStyles): CSSProperties {
  return {
    width: '100%',
    height: '100%',
    ...(styles.padding !== undefined && { padding: styles.padding }),
    ...(styles.margin !== undefined && { margin: styles.margin }),
    ...(styles.background !== undefined && { background: styles.background }),
    ...(styles.color !== undefined && { color: styles.color }),
    ...(styles.borderRadius !== undefined && { borderRadius: styles.borderRadius }),
    ...(styles.fontSize !== undefined && { fontSize: styles.fontSize }),
    ...(styles.fontWeight !== undefined && { fontWeight: styles.fontWeight }),
    ...(styles.fontFamily !== undefined && { fontFamily: styles.fontFamily }),
    ...(styles.textAlign !== undefined && { textAlign: styles.textAlign }),
  }
}

// @deprecated Use toWrapperStyle + toContentStyle instead.
export function toInlineStyle(
  styles: ElementStyles,
  parentLayoutMode: 'absolute' | 'flow' = 'absolute',
): CSSProperties {
  const base: CSSProperties = {
    ...(styles.padding !== undefined && { padding: styles.padding }),
    ...(styles.margin !== undefined && { margin: styles.margin }),
    ...(styles.background !== undefined && { background: styles.background }),
    ...(styles.color !== undefined && { color: styles.color }),
    ...(styles.borderRadius !== undefined && { borderRadius: styles.borderRadius }),
    ...(styles.fontSize !== undefined && { fontSize: styles.fontSize }),
    ...(styles.fontWeight !== undefined && { fontWeight: styles.fontWeight }),
    ...(styles.fontFamily !== undefined && { fontFamily: styles.fontFamily }),
    ...(styles.textAlign !== undefined && { textAlign: styles.textAlign }),
  }

  if (parentLayoutMode === 'absolute') {
    return {
      position: 'absolute',
      left: styles.x,
      top: styles.y,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex,
      ...base,
    }
  }

  return {
    width: styles.width,
    height: styles.height,
    ...base,
  }
}

export function toClassName(_styles: ElementStyles): string {
  return 'box-border'
}
