import {TestBed} from '@angular/core/testing'

import {AuthErrInterceptor} from './auth-err.interceptor'

describe('AuthErrInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [AuthErrInterceptor]
    })
  )

  it('should be created', () => {
    const interceptor: AuthErrInterceptor = TestBed.inject(AuthErrInterceptor)
    expect(interceptor).toBeTruthy()
  })
})
