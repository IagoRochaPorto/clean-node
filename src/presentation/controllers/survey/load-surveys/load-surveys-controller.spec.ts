import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { ok, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }]
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysStub()
}

interface SystemUnderTestTypes {
  systemUnderTest: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const systemUnderTest = new LoadSurveysController(loadSurveysStub)
  return {
    systemUnderTest,
    loadSurveysStub
  }
}

describe('LoadSurveys controller', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurveys', async () => {
    const { systemUnderTest, loadSurveysStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await systemUnderTest.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()

    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { systemUnderTest, loadSurveysStub } = makeSystemUnderTest()
    jest
      .spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
