export type CustomText = {
  text: string
  bold?: true
  italic?: true
  underline?: true
  strikethrough?: true
  code?: true
  color?: string // or number/const
  highlight?: boolean // consider string for multicolor highlight
}

export type TextOrInline = CustomText | LinkElement

export type VoidText = {
  text: ""
}

export type RootElement =
  | ParagraphElement
  | HeadingElement
  | ListElement
  | ImageElement
  | VideoElement
  | LinkElement
  | TableElement
  | FileElement

export type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

export type HeadingElement = {
  type: "heading"
  level: 1 | 2 | 3
  children: CustomText[]
}

export type ListElement = {
  type: "ul" | "ol" | "checked" | "unchecked"
  depth: number
  children: CustomText[]
}

export type ImageElement = {
  type: "image"
  url: string
  children: VoidText[]
}

export type VideoElement = {
  type: "video"
  url: string
  children: VoidText[]
}

export type LinkElement = {
  type: "link"
  url: string
  children: CustomText[]
}

/**
 * Consider making a Table cell a first class container for other elements so
 * it can contain lists, etc. The behavior or `enter` will have to change.
 */
export type TableElement = {
  type: "table"
  expanded: boolean
  children: TrElement[]
}

export type TrElement = { type: "tr"; children: TdElement[] }

export type TdElement = {
  type: "td"
  children: Exclude<RootElement, TableElement>
}

export type FileElement = { type: "file"; children: VoidText[] }

export type CardElement = { type: "card"; children: VoidText[] }

export type DividerElement = { type: "divider"; children: VoidText[] }

export type IFrameElement = { type: "iframe"; children: VoidText[] }

/**
 * This is the fastest way to implement it but I'm not quite sure I understand
 * the purpose of having a pseudo-WYSIWYG element in a WYSIWYG element.
 *
 * Consider (at a future date) to convert markdown to rich text and turn this
 * into an Import Markdown feature instead.
 */
export type MarkdownElement = {
  type: "markdown"
  children: VoidText[]
  markdown: string
}
