export function generatePositionBetween(
  before: string | null | undefined,
  after: string | null | undefined
): string {
  if (!before && !after) return "m";

  if (!before && after) {
    const charCode = after.charCodeAt(0);
    if (charCode > 97) {
      return String.fromCharCode(Math.floor((97 + charCode) / 2));
    }
    return "a" + after;
  }

  if (before && !after) {
    const charCode = before.charCodeAt(before.length - 1);
    if (charCode < 122) {
      return before.slice(0, -1) + String.fromCharCode(Math.floor((charCode + 122) / 2));
    }
    return before + "m";
  }

  const b = before!;
  const a = after!;
  let i = 0;

  while (i < b.length && i < a.length && b[i] === a[i]) {
    i++;
  }

  const bChar = i < b.length ? b.charCodeAt(i) : 96;
  const aChar = i < a.length ? a.charCodeAt(i) : 123;

  if (aChar - bChar > 1) {
    const mid = Math.floor((bChar + aChar) / 2);
    return b.slice(0, i) + String.fromCharCode(mid);
  }

  return b + "m";
}

export const generateKeyBetween = generatePositionBetween;