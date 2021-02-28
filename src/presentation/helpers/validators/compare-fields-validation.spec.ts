import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSystemUnderTest = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'field_to_compare')
}

describe('RequiredField validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({ field: 'any_value', field_to_compare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('field_to_compare'))
  })

  test('Should not return if validation fails', () => {
    const systemUnderTest = makeSystemUnderTest()
    const error = systemUnderTest.validate({ field: 'any_value', field_to_compare: 'any_value' })
    expect(error).toBeFalsy()
  })
})
