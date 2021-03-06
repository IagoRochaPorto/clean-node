import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSystemUnderTest = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    return await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    await systemUnderTest.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toEqual(1)
  })
})
