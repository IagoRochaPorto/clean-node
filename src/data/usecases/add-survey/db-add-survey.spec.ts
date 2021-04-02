import { AddSurveyModel, DbAddSurvey, AddSurveyRepository } from './db-add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRespositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

interface SystemUnderTestTypes {
  systemUnderTest: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRespositoryStub()
  const systemUnderTest = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    systemUnderTest,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
