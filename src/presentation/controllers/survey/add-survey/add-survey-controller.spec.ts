import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

interface SystemUnderTestTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const systemUnderTest = new AddSurveyController(validationStub, addSurveyStub)
  return {
    systemUnderTest,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await systemUnderTest.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { systemUnderTest, addSurveyStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await systemUnderTest.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
