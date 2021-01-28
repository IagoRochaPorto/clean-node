import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount
  encrypterStub: Encrypter
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const systemUnderTest = new DbAddAccount(encrypterStub)

  return {
    systemUnderTest,
    encrypterStub
  }
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
})
