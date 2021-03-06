import {
  CustomText,
  LinkElement,
  RootElement,
  TableRowElement,
  TableElement,
  TableCellElement,
  TextOrInline,
} from "./types"
import { log } from "./test/utils"

export function convertTextLeaf(node: any): CustomText {
  if (node.object !== "leaf") {
    throw new Error("Expected a leaf")
  }
  const nextText: CustomText = { text: node.text }
  if (node.marks) {
    for (const mark of node.marks) {
      switch (mark.type) {
        case "BOLD":
          nextText.bold = true
          break
        case "ITALIC":
          nextText.italic = true
          break
        case "UNDERLINE":
          nextText.underline = true
          break
      }
    }
  }
  return nextText
}

export function convertTextObject(node: any): CustomText[] {
  return node.leaves.map(convertTextLeaf)
}

export function convertInlineLink(node: any): LinkElement {
  if (node.type !== "LINK") {
    throw new Error("Expected a link")
  }
  return {
    type: "link",
    url: node.data.href,
    children: convertTextObject(node.nodes[0]),
  }
}

export function convertTextAndInlineNode(node: any): TextOrInline[] {
  switch (node.object) {
    case "text":
      return convertTextObject(node)
    case "inline":
      return [convertInlineLink(node)]
    default:
      throw new Error(`Unhandled node.object type`)
  }
}

export function convertTextAndInlineNodes(nodes: any[]): TextOrInline[] {
  const nextNodes = []
  for (const node of nodes) {
    nextNodes.push(...convertTextAndInlineNode(node))
  }
  return nextNodes
}

export function convertBlockNode(node: any): RootElement {
  switch (node.type) {
    case "TITLE":
      return {
        type: "heading",
        level: 1,
        children: convertTextAndInlineNodes(node.nodes),
      }
    // NOTE:
    // Looks like paragraphs are stored in lowercase for some reason.
    // For safety, I added the uppercase version as well
    case "paragraph":
    case "PARAGRAPH":
      return {
        type: "paragraph",
        children: convertTextAndInlineNodes(node.nodes),
      }
    case "TABLE":
      return convertTable(node)
    default:
      throw new Error(`Unhandled node.type of ${JSON.stringify(node.type)}`)
  }
}

export function convertBlockNodes(nodes: any[]) {
  return nodes.map(convertBlockNode)
}

export function convertDocument(node: any) {
  if (node.object !== "value") {
    throw new Error("Expected top level to have `object`==`value`")
  }
  return convertBlockNodes(node.document.nodes)
}

function convertTable(node: any): TableElement {
  if (node.type !== "TABLE") {
    throw new Error(`Expected node.type to be "TABLE"`)
  }
  return {
    type: "table",
    expanded: false,
    children: node.nodes.map(convertTableRow),
  }
}

function convertTableRow(node: any): TableRowElement {
  if (node.type !== "TABLE_ROW") {
    throw new Error(`Expected node.type to be "TABLE_ROW`)
  }
  return {
    type: "tr",
    children: node.nodes.map(convertTableCell),
  }
}

function convertTableCell(node: any): TableCellElement {
  return {
    type: "td",
    children: convertTextAndInlineNodes(node.nodes),
  }
}
