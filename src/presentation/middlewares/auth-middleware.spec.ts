import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-acess-token exists in headers', async () => {
    const systemUnderTest = new AuthMiddleware()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
