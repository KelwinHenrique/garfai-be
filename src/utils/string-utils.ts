/**
 * String utility functions
 */

/**
 * Converts a string to a URL-friendly slug
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Split accented characters
    .replace(/[\u0300-\u036f]/g, '')   // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')              // Replace spaces with -
    .replace(/[^\w-]+/g, '')           // Remove all non-word chars
    .replace(/--+/g, '-')              // Replace multiple - with single -
    .replace(/^-+/, '')                // Trim - from start of text
    .replace(/-+$/, '');               // Trim - from end of text
}
