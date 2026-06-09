import type { Element } from '@/types'
import { TextRenderer } from './renderers/TextRenderer'
import { HeadingRenderer } from './renderers/HeadingRenderer'
import { ImageRenderer } from './renderers/ImageRenderer'
import { ButtonRenderer } from './renderers/ButtonRenderer'
import { DividerRenderer } from './renderers/DividerRenderer'
import { SpacerRenderer } from './renderers/SpacerRenderer'
import { ContainerRenderer } from './renderers/ContainerRenderer'
import { SelectionWrapper } from './SelectionWrapper'

interface ElementRendererProps {
  element: Element
  parentLayoutMode?: 'absolute' | 'flow'
}

export function ElementRenderer({ element, parentLayoutMode = 'absolute' }: ElementRendererProps) {
  function renderInner() {
    switch (element.type) {
      case 'text':
        return <TextRenderer element={element} />
      case 'heading':
        return <HeadingRenderer element={element} />
      case 'image':
        return <ImageRenderer element={element} />
      case 'button':
        return <ButtonRenderer element={element} />
      case 'divider':
        return <DividerRenderer element={element} />
      case 'spacer':
        return <SpacerRenderer element={element} />
      case 'container':
      case 'row':
      case 'column':
      case 'grid':
        return <ContainerRenderer element={element} />
    }
  }

  return (
    <SelectionWrapper element={element} parentLayoutMode={parentLayoutMode}>
      {renderInner()}
    </SelectionWrapper>
  )
}
