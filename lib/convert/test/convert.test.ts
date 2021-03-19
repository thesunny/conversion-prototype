import {
  convertBlockNode,
  convertDocument,
  convertTextLeaf,
  convertTextAndInlineNode,
} from "../legacy-to-next"
import CONVERT_TEST_CARD_JSON from "./convert-test-card.json"

function log(json: any) {
  console.log(JSON.stringify(json, null, 2))
}

describe("test", () => {
  describe("text and inlines", () => {
    it("should convert a text leaf", async () => {
      const legacy = { object: "leaf", text: "What are Cards?", marks: [] }
      const next = convertTextLeaf(legacy)
      expect(next).toEqual({ text: "What are Cards?" })
    })

    it("should convert a text node with a simple leaf", async () => {
      const legacy = {
        object: "text",
        leaves: [{ object: "leaf", text: "What are Cards?", marks: [] }],
      }
      const next = convertTextAndInlineNode(legacy)
      expect(next).toEqual([{ text: "What are Cards?" }])
    })

    it("should convert a text node with a bold", async () => {
      const legacy = {
        object: "text",
        leaves: [
          {
            object: "leaf",
            text: "bold text",
            marks: [{ object: "mark", type: "BOLD", data: {} }],
          },
        ],
      }
      const next = convertTextAndInlineNode(legacy)
      expect(next).toEqual([{ text: "bold text", bold: true }])
    })

    it("should convert a link node", async () => {
      const legacy = {
        object: "inline",
        type: "LINK",
        isVoid: false,
        data: {
          href: "https://www.google.com/",
          hasPlaceholder: false,
          editing: false,
        },
        nodes: [
          {
            object: "text",
            leaves: [{ object: "leaf", text: "link", marks: [] }],
          },
        ],
      }
      const next = convertTextAndInlineNode(legacy)
      expect(next).toEqual([
        {
          type: "link",
          url: "https://www.google.com/",
          children: [{ text: "link" }],
        },
      ])
    })
  })

  describe("simple types like paragraphs and headings", () => {
    it("should convert a paragraph", async () => {
      const legacy = {
        object: "block",
        type: "PARAGRAPH",
        isVoid: false,
        data: {},
        nodes: [
          {
            object: "text",
            leaves: [{ object: "leaf", text: "Conversion Test", marks: [] }],
          },
        ],
      }
      const next = convertBlockNode(legacy)
      expect(next).toEqual({
        type: "paragraph",
        children: [{ text: "Conversion Test" }],
      })
    })

    it("should convert a title to heading with depth 1", async () => {
      const legacy = {
        object: "block",
        type: "TITLE",
        isVoid: false,
        data: {},
        nodes: [
          {
            object: "text",
            leaves: [{ object: "leaf", text: "What are Cards?", marks: [] }],
          },
        ],
      }
      const next = convertBlockNode(legacy)
      expect(next).toEqual({
        type: "heading",
        level: 1,
        children: [{ text: "What are Cards?" }],
      })
    })

    it("should convert a paragraph with mixed styles", async () => {
      const legacy = {
        object: "block",
        type: "paragraph",
        isVoid: false,
        data: {},
        nodes: [
          {
            object: "text",
            leaves: [
              { object: "leaf", text: "This is some ", marks: [] },
              {
                object: "leaf",
                text: "bold",
                marks: [{ object: "mark", type: "BOLD", data: {} }],
              },
              { object: "leaf", text: ", ", marks: [] },
              {
                object: "leaf",
                text: "italic",
                marks: [{ object: "mark", type: "ITALIC", data: {} }],
              },
              { object: "leaf", text: ", ", marks: [] },
              {
                object: "leaf",
                text: "underlined",
                marks: [{ object: "mark", type: "UNDERLINE", data: {} }],
              },
              { object: "leaf", text: " text and a ", marks: [] },
            ],
          },
          {
            object: "inline",
            type: "LINK",
            isVoid: false,
            data: {
              href: "https://www.google.com/",
              hasPlaceholder: false,
              editing: false,
            },
            nodes: [
              {
                object: "text",
                leaves: [{ object: "leaf", text: "link", marks: [] }],
              },
            ],
          },
          {
            object: "text",
            leaves: [{ object: "leaf", text: "", marks: [] }],
          },
        ],
      }
      const next = convertBlockNode(legacy)
      expect(next).toEqual({
        type: "paragraph",
        children: [
          { text: "This is some " },
          { text: "bold", bold: true },
          { text: ", " },
          { text: "italic", italic: true },
          { text: ", " },
          { text: "underlined", underline: true },
          { text: " text and a " },
          {
            type: "link",
            url: "https://www.google.com/",
            children: [{ text: "link" }],
          },
          { text: "" },
        ],
      })
    })
  })

  describe("convert the full document data from full JSON", () => {
    const next = convertDocument(CONVERT_TEST_CARD_JSON)
    expect(next).toEqual([
      {
        type: "heading",
        level: 1,
        children: [{ text: "Conversion Test" }],
      },
      {
        type: "paragraph",
        children: [
          { text: "This is some " },
          { text: "bold", bold: true },
          { text: ", " },
          { text: "italic", italic: true },
          { text: ", " },
          { text: "underlined", underline: true },
          { text: " text and a " },
          {
            type: "link",
            url: "https://www.google.com/",
            children: [{ text: "link" }],
          },
          { text: "" },
        ],
      },
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ])
  })
})
