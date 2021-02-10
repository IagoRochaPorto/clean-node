import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => new Promise(resolve => resolve('hash'))
}))

const salt = 12

const makeSystemUnderTest = (): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await systemUnderTest.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hash = await systemUnderTest.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
