export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^0-9a-z]/gim, ' ')
    .trim()
    .replace(/\s+/g, '-')
}
