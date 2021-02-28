import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SystemUnderTestTypes {
  systemUnderTest: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const emailValidatorStub = makeEmailValidator()
  const systemUnderTest = new EmailValidation(emailValidatorStub, 'email')

  return {
    systemUnderTest,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if email validator returns false', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = systemUnderTest.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = { email: 'any_email@mail.com' }
    systemUnderTest.validate(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(systemUnderTest.validate).toThrow()
  })
})
