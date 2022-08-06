import {
  HateoasProjection,
  HateoasResource,
  Resource
} from '@lagoshny/ngx-hateoas-client'

@HateoasResource('users')
export class User extends Resource {
  username = ''
  email = ''
  enabled = false
  locked = true
  // todo: roles:
  expiredAt = ''
  credentialExpiredAt = ''
}

@HateoasProjection(User, 'withUsernameEmail')
export class WithUsernameEmailUser extends Resource {
  username = ''
  email = ''
}
