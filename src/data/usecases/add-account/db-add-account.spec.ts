import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount
  encrypterStub: Encrypter
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const encrypterStub = makeEncrypter()
  const systemUnderTest = new DbAddAccount(encrypterStub)

  return {
    systemUnderTest,
    encrypterStub
  }
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, systemUnderTest } = makeSystemUnderTest()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await systemUnderTest.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = systemUnderTest.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
