import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}

interface SystemUnderTestTypes {
  systemUnderTest: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
  return {
    loadAccountByTokenStub,
    systemUnderTest
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-acess-token exists in headers', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { loadAccountByTokenStub, systemUnderTest } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await systemUnderTest.handle({
      headers: { 'x-access-token': 'any_token' }
    })
    expect(loadSpy).toHaveBeenLastCalledWith('any_token')
  })
})
