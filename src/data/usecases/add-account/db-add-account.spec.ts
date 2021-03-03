
import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const systemUnderTest = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    systemUnderTest,
    hasherStub,
    addAccountRepositoryStub
  }
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherStub, systemUnderTest } = makeSystemUnderTest()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await systemUnderTest.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { hasherStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, systemUnderTest } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await systemUnderTest.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if Hasher throws', async () => {
    const { addAccountRepositoryStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = systemUnderTest.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an Account on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const account = await systemUnderTest.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
