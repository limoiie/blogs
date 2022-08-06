import {
  HateoasProjection,
  HateoasResource,
  ProjectionRel,
  ProjectionRelType,
  Resource
} from '@lagoshny/ngx-hateoas-client'
import {User, WithUsernameEmailUser} from './user'

@HateoasResource('blogs')
export class Blog extends Resource {
  title = ''
  author?: User
  folder = ''
  tags: string[] = [] // todo
  visibility = false
  abstract = ''
  createTime = ''
  editTime = ''
  htmlDocument = ''
  originDocument = ''
  originDocumentExt = ''
}

@HateoasProjection(Blog, 'withAbstractDocument')
export class WithAbstractBlog extends Resource {
  id = ''
  title = ''
  @ProjectionRel(WithUsernameEmailUser)
    author?: ProjectionRelType<WithUsernameEmailUser>
  folder = ''
  tags: string[] = [] // todo
  visibility = ''
  createTime = ''
  editTime = ''
  abstract = ''
}

@HateoasProjection(Blog, 'withHtmlDocument')
export class WithHtmlDocumentBlog extends Resource {
  id = ''
  title = ''
  @ProjectionRel(WithUsernameEmailUser)
    author?: ProjectionRelType<WithUsernameEmailUser>
  folder = ''
  tags: string[] = [] // todo
  visibility = ''
  createTime = ''
  editTime = ''
  htmlDocument = ''
}
