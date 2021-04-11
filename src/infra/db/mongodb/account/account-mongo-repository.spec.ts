import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSystemUnderTest = (): AccountMongoRepository => new AccountMongoRepository()

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const account = await systemUnderTest.add({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })
      const account = await systemUnderTest.loadByEmail('any_mail@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const account = await systemUnderTest.loadByEmail('any_mail@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await systemUnderTest.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBeTruthy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await systemUnderTest.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  test('Should return an account on loadByToken with role success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      accessToken: 'any_token',
      role: 'any_role'
    })
    const account = await systemUnderTest.loadByToken('any_token', 'any_role')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByToken fails', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const account = await systemUnderTest.loadByToken('any_token')
    expect(account).toBeFalsy()
  })
})
