import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SystemUnderTestTypes {
  systemUnderTest: ValidationComposite
  validationStub: Validation
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const systemUnderTest = new ValidationComposite([validationStub])
  return {
    systemUnderTest,
    validationStub

  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
