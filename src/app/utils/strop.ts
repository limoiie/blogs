
export function slug(text: string): string {
  return text.toLowerCase()
    .replace(/[^0-9a-z]/gmi, ' ').trim()
    .replace(/\s+/g, '-');
}
