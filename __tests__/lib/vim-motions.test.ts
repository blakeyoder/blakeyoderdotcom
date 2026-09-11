/**
 * Tests for the vim tutorial cursor motions.
 *
 * The regression that prompted these: `k` searched backwards from
 * currentLineStart - 2, skipping the newline that terminates the previous
 * line, so it moved two lines up instead of one.
 */

import { describe, it, expect } from "bun:test";
import {
  column,
  deleteLine,
  lineEnd,
  lineStart,
  moveDown,
  moveToLineEnd,
  moveUp,
} from "@/lib/vim-motions";

const DOC = "line0\nline1\nline2\nline3";
// offsets:   0      6      12     18

describe("lineStart / lineEnd / column", () => {
  it("finds the start of each line", () => {
    expect(lineStart(DOC, 2)).toBe(0);
    expect(lineStart(DOC, 8)).toBe(6);
    expect(lineStart(DOC, 14)).toBe(12);
  });

  it("finds the end of each line", () => {
    expect(lineEnd(DOC, 2)).toBe(5);
    expect(lineEnd(DOC, 8)).toBe(11);
    expect(lineEnd(DOC, 20)).toBe(DOC.length);
  });

  it("reports the column within the line", () => {
    expect(column(DOC, 14)).toBe(2);
    expect(column(DOC, 12)).toBe(0);
  });
});

describe("moveUp", () => {
  it("moves exactly one line, not two", () => {
    // On line2 at column 2 -> line1 at column 2 (offset 8).
    expect(moveUp(DOC, 14)).toBe(8);
  });

  it("moves one line from line3 to line2", () => {
    expect(moveUp(DOC, 20)).toBe(14);
  });

  it("moves from line1 to line0", () => {
    expect(moveUp(DOC, 8)).toBe(2);
  });

  it("stays put on the first line", () => {
    expect(moveUp(DOC, 2)).toBe(2);
  });

  it("clamps the column when the line above is shorter", () => {
    const doc = "ab\nlonger line";
    // column 8 on line 1 -> clamped to the end of "ab" (offset 2)
    expect(moveUp(doc, 11)).toBe(2);
  });

  it("round-trips with moveDown", () => {
    const start = 14;
    expect(moveUp(DOC, moveDown(DOC, start))).toBe(start);
  });
});

describe("moveDown", () => {
  it("moves exactly one line", () => {
    expect(moveDown(DOC, 2)).toBe(8);
    expect(moveDown(DOC, 8)).toBe(14);
  });

  it("stays put on the last line", () => {
    expect(moveDown(DOC, 20)).toBe(20);
  });

  it("clamps the column when the line below is shorter", () => {
    const doc = "longer line\nab";
    expect(moveDown(doc, 8)).toBe(14);
  });
});

describe("moveToLineEnd", () => {
  it("goes to the end of the current line", () => {
    expect(moveToLineEnd(DOC, 8)).toBe(11);
  });

  it("goes to the end of the document on the last line", () => {
    expect(moveToLineEnd(DOC, 19)).toBe(DOC.length);
  });
});

describe("deleteLine", () => {
  it("removes the line under the cursor", () => {
    const result = deleteLine(DOC, 8);
    expect(result.content).toBe("line0\nline2\nline3");
  });

  it("removes the first line", () => {
    expect(deleteLine(DOC, 0).content).toBe("line1\nline2\nline3");
  });

  it("leaves a single-line document alone", () => {
    expect(deleteLine("only", 2).content).toBe("only");
  });

  it("keeps the caret inside the new content", () => {
    const result = deleteLine(DOC, 20);
    expect(result.position).toBeLessThanOrEqual(result.content.length);
  });
});
