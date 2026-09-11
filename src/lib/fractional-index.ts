import { generateKeyBetween } from "fractional-indexing";

/**
 * Generates a lexicographical string that sorts exactly between `prev` and `next`.
 * - If both are null, generates the first item string.
 * - If `prev` is null, generates a string before `next`.
 * - If `next` is null, generates a string after `prev`.
 */
export function getLexicographicalIndex(
  prev: string | null = null,
  next: string | null = null
): string {
  try {
    return generateKeyBetween(prev, next);
  } catch (error) {
    console.error("Error generating fractional index:", error);
    // Fallback to prevent app crashes in edge cases
    return generateKeyBetween(null, null);
  }
}