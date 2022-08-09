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
  roles: string[] = []
  expiredAt = ''
  credentialExpiredAt = ''
}

@HateoasProjection(User, 'withUsernameEmail')
export class WithUsernameEmailUser extends Resource {
  username = ''
  email = ''
}

@HateoasProjection(User, 'withFullProfile')
export class WithFullProfileUser extends WithUsernameEmailUser {
  enabled = false
  locked = true
  roles: string[] = []
  expiredAt = ''
  credentialExpiredAt = ''
}

export class TokenAndProfileUser {
  token: string
  user: WithFullProfileUser

  constructor(token: string, user: WithFullProfileUser) {
    this.token = token
    this.user = user
  }
}
