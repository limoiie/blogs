import {HateoasResource, Resource} from '@lagoshny/ngx-hateoas-client'

@HateoasResource('tags')
export class Tag extends Resource {
  id = ''
  name = ''
}
