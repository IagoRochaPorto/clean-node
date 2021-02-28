import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface systemUnderTestTypes {
  systemUnderTest: LoginController
}

const makeSystemUnderTest = (): systemUnderTestTypes => {
  const systemUnderTest = new LoginController()
  return {
    systemUnderTest
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
