
import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'
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

interface SystemUnderTestTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const systemUnderTest = new AddSurveyController(validationStub)
  return {
    systemUnderTest,
    validationStub
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
})
