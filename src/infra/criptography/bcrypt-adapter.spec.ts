import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => new Promise(resolve => resolve('hash')),
  compare: async (): Promise<boolean> => new Promise(resolve => resolve(true))
}))

const salt = 12

const makeSystemUnderTest = (): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await systemUnderTest.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hash = await systemUnderTest.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const systemUnderTest = makeSystemUnderTest()
    jest.spyOn(bcrypt, 'hash').mockReturnValue(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await systemUnderTest.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
