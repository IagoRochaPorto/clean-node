import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}
interface SystemUnderTestTypes {
  systemUnderTest: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const decrypterStub = makeDecrypter()
  const systemUnderTest = new DbLoadAccountByToken(decrypterStub)
  return {
    systemUnderTest,
    decrypterStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { systemUnderTest, decrypterStub } = makeSystemUnderTest()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await systemUnderTest.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter return null', async () => {
    const { systemUnderTest, decrypterStub } = makeSystemUnderTest()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
