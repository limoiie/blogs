import {marked} from 'marked'
import {MarkdownService, MarkedOptions} from 'ngx-markdown'

/**
 * Re-render the header tag
 *
 * @param rootUrl Page url
 * @param text Text inside the header tag
 * @param level Header level
 * @param raw The raw header source text
 * @param slugger A [[`Slugger`]] that can convert a text into a legal id
 */
export function renderHeading(
  rootUrl: string,
  text: string,
  level: number,
  raw: string,
  slugger: marked.Slugger
): string {
  const header = `h${level}`
  if (level === 2 || level === 3) {
    const id = slugger.slug(text)
    return `<${header} id="${id}"><a href="${rootUrl}#${id}">${text}</a></${header}>`
  }
  return `<${header}>${text}</${header}>`
}

export function markedOptionsFactory(): MarkedOptions {
  // const renderer = new MarkedRenderer()
  // custom render style
  // renderer.blockquote = (text: string) => {
  //   return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>'
  // }

  // renderer.heading = renderHeading

  return {
    // renderer,
    gfm: true,
    breaks: false,
    headerIds: true,
    pedantic: false,
    smartLists: true,
    smartypants: false
  }
}

// Fix the bug that many properties, such as id, are removed
// after compiled by the markdown service. The reason of this
// bug is that the domSanitizer used by the service will remove
// these properties.
export function fixMarkdownService(service: MarkdownService) {
  const markedOpt = service.options
  service.parse = (
    markdown,
    opt = {
      decodeHtml: false,
      markedOptions: markedOpt
    }
  ) => {
    const trimmed = trimIndentation(markdown)
    const decoded = opt.decodeHtml ? decodeHtml(trimmed) : trimmed
    return marked.parse(decoded, markedOpt)
  }
}

// see MarkdownService::trimIndentation
function trimIndentation(markdown: string): string {
  if (!markdown) {
    return ''
  }
  let indentStart: number
  return markdown
    .split('\n')
    .map((line) => {
      let lineIdentStart = indentStart
      if (line.length > 0) {
        lineIdentStart = isNaN(lineIdentStart)
          ? line.search(/\S|$/)
          : Math.min(line.search(/\S|$/), lineIdentStart)
      }
      if (isNaN(indentStart)) {
        indentStart = lineIdentStart
      }
      return lineIdentStart ? line.substring(lineIdentStart) : line
    })
    .join('\n')
}

// see MarkdownService::decodeHtml
function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}
