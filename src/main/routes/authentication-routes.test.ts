import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => await (await MongoHelper.getCollection('account')).deleteMany({}))

  describe('POST /signup', () => {
    test('Should return an account on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Iago',
          email: 'iagorochaporto@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })
})
