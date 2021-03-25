
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SystemUnderTestTypes {
  systemUnderTest: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const systemUnderTest = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    systemUnderTest,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
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
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
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
      email: 'valid_email@mail.com',
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

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
