import { MongoHelper as systemUnterTest } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => await systemUnterTest.connect(process.env.MONGO_URL))
  afterAll(async () => await systemUnterTest.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await systemUnterTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await systemUnterTest.disconnect()
    accountCollection = await systemUnterTest.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
