import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },
  async verify(token: string): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))

const makeSystemUnderTest = (): JwtAdapter => new JwtAdapter('secret')

describe('Jwt Adapter', () => {
  describe('Sign()', () => {
    test('Should call sign with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const signSpy = jest.spyOn(jwt, 'sign')
      await systemUnderTest.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const accessToken = await systemUnderTest.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = systemUnderTest.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await systemUnderTest.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on sign success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const accessToken = await systemUnderTest.decrypt('any_id')
      expect(accessToken).toBe('any_value')
    })
  })
})
