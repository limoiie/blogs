import {Sort} from '@lagoshny/ngx-hateoas-client'
import {PageParam} from '@lagoshny/ngx-hateoas-client/lib/model/declarations'

export interface Pageable {
  sort?: Sort
  pageParams: PageParam
}
