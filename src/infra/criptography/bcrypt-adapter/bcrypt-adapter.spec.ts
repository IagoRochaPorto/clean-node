import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => new Promise(resolve => resolve('hash')),
  compare: async (): Promise<boolean> => new Promise(resolve => resolve(true))
}))

const salt = 12

const makeSystemUnderTest = (): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
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

    test('Should throw if hash throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'hash').mockReturnValue(new Promise((resolve, reject) => reject(new Error())))
      const promise = systemUnderTest.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await systemUnderTest.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fail', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare').mockReturnValue(new Promise((resolve, reject) => reject(new Error())))
      const promise = systemUnderTest.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
