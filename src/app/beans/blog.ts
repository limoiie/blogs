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
  id = ''
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

  get createDate(): Date {
    return this.createTime ? new Date(this.createTime) : new Date()
  }

  get editDate(): Date {
    return this.editTime ? new Date(this.editTime) : new Date()
  }
}

@HateoasProjection(Blog, 'withAbstract')
export class WithAbstractBlog extends Resource {
  id = ''
  title = ''
  @ProjectionRel(WithUsernameEmailUser)
    author?: ProjectionRelType<WithUsernameEmailUser>
  folder = ''
  tags: string[] = [] // todo
  visibility = false
  createTime = ''
  editTime = ''
  abstract = ''

  get createDate(): Date {
    return this.createTime ? new Date(this.createTime) : new Date()
  }

  get editDate(): Date {
    return this.editTime ? new Date(this.editTime) : new Date()
  }
}

@HateoasProjection(Blog, 'withHtmlDocument')
export class WithHtmlDocumentBlog extends Resource {
  id = ''
  title = ''
  @ProjectionRel(WithUsernameEmailUser)
    author?: ProjectionRelType<WithUsernameEmailUser>
  folder = ''
  tags: string[] = [] // todo
  visibility = false
  createTime = ''
  editTime = ''
  htmlDocument = ''

  get createDate(): Date {
    return this.createTime ? new Date(this.createTime) : new Date()
  }

  get editDate(): Date {
    return this.editTime ? new Date(this.editTime) : new Date()
  }
}
