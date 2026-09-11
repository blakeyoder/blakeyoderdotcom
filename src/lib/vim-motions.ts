/**
 * Cursor motions for the vim tutorial.
 *
 * Pure functions over (content, position) so the line arithmetic can be tested
 * without a DOM. Positions are character offsets into `content`.
 */

/** Offset of the first character on the line containing `position`. */
export function lineStart(content: string, position: number): number {
  return content.lastIndexOf("\n", position - 1) + 1;
}

/** Offset of the end of the line containing `position` (exclusive). */
export function lineEnd(content: string, position: number): number {
  const next = content.indexOf("\n", position);
  return next === -1 ? content.length : next;
}

/** Column of `position` within its line. */
export function column(content: string, position: number): number {
  return position - lineStart(content, position);
}

/**
 * Moves one line up, keeping the column where possible.
 * Returns the original position when already on the first line.
 */
export function moveUp(content: string, position: number): number {
  const start = lineStart(content, position);
  if (start === 0) return position;

  const col = position - start;
  // The newline immediately before this line is the previous line's terminator.
  const previousEnd = start - 1;
  const previousStart = content.lastIndexOf("\n", previousEnd - 1) + 1;
  const previousLength = previousEnd - previousStart;

  return previousStart + Math.min(col, previousLength);
}

/**
 * Moves one line down, keeping the column where possible.
 * Returns the original position when already on the last line.
 */
export function moveDown(content: string, position: number): number {
  const end = lineEnd(content, position);
  if (end === content.length) return position;

  const col = position - lineStart(content, position);
  const nextStart = end + 1;
  const nextEnd = lineEnd(content, nextStart);
  const nextLength = nextEnd - nextStart;

  return nextStart + Math.min(col, nextLength);
}

/** Moves to the end of the current line. */
export function moveToLineEnd(content: string, position: number): number {
  return lineEnd(content, position);
}

/** Deletes the line containing `position`, returning the new content and caret. */
export function deleteLine(
  content: string,
  position: number,
): { content: string; position: number } {
  const lines = content.split("\n");
  if (lines.length <= 1) return { content, position };

  const index = content.slice(0, position).split("\n").length - 1;
  lines.splice(index, 1);
  const next = lines.join("\n");
  const caret = Math.min(lineStart(content, position), next.length);

  return { content: next, position: caret };
}
