import {RequestParam} from '@lagoshny/ngx-hateoas-client'

export interface BlogFilter {
  query: string,
  tags: string[]
}

export function blogFilterToParams(filter: BlogFilter): RequestParam {
  return {
    query: filter.query,
    tags: filter.tags
  }
}
