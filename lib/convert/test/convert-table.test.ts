import LEGACY_TABLE_JSON from "../samples/table.json"
import { convertDocument } from "../legacy-to-next"

describe("convert table", () => {
  it("should convert a table", async () => {
    const legacy = LEGACY_TABLE_JSON
    const next = convertDocument(legacy)
    expect(next).toEqual([
      {
        type: "heading",
        level: 1,
        children: [{ text: "Table" }],
      },
      {
        type: "table",
        expanded: false,
        children: [
          {
            type: "tr",
            children: [
              { type: "td", children: [{ text: "alpha 1" }] },
              { type: "td", children: [{ text: "bravo 1" }] },
              { type: "td", children: [{ text: "charlie 1" }] },
            ],
          },
          {
            type: "tr",
            children: [
              { type: "td", children: [{ text: "alpha 2" }] },
              { type: "td", children: [{ text: "bravo 2" }] },
              { type: "td", children: [{ text: "charlie 2" }] },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ])
  })
})
