import {RequestParam} from '@lagoshny/ngx-hateoas-client'

export interface BlogFilter {
  tags: string[]
}

export function blogFilterToParams(filter: BlogFilter): RequestParam {
  return {
    tags: filter.tags
  }
}
