import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('any_field')
    const error = systemUnderTest.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('any_field')
    const error = systemUnderTest.validate({ any_field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
