import { SupportedFieldsEnum } from '../enums'
import { IFieldDefinition } from '@/server/services/types'

export const SUPPORTED_INPUT_FIELDS = [
    SupportedFieldsEnum.PassCode,
    SupportedFieldsEnum.Password,
    SupportedFieldsEnum.PasswordNumeric
]
export const SUPPORTED_INPUT_FIELD_STRING_MAPPING = {
    [SupportedFieldsEnum.PassCode]: 'Passcode',
    [SupportedFieldsEnum.Password]: 'Password',
    [SupportedFieldsEnum.PasswordNumeric]: 'Numeric password'
}
export const SUPPORTED_FIELDS: { [key: string]: IFieldDefinition } = {
    [SupportedFieldsEnum.Password]: {
        // permanent: false,
        type: 'password',
        label: 'Password',
        maxContent:
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    [SupportedFieldsEnum.PasswordNumeric]: {
        // permanent: false,
        type: 'passwordNumeric',
        label: 'Password',
        maxContent: '0000000000'
    },
    [SupportedFieldsEnum.CardNumber]: {
        permanent: true,
        type: 'tel',
        label: 'Card number',
        autocorrect: '0000 0000 0000 0000 000    F    F    F    F???',
        maxContent: '0000000000000000000'
    },
    [SupportedFieldsEnum.CVV]: {
        permanent: true,
        type: 'tel',
        label: 'Card CVC/CVV',
        autocorrect: '0000   ?',
        maxContent: '0000'
    },
    [SupportedFieldsEnum.CardPin]: {
        permanent: false,
        type: 'tel',
        label: 'Card pin',
        autocorrect: '0000   ?',
        maxContent: '0000',
        regex: '^\\d{4}$',
        regexMessage: 'Card pin must be a 4 digit number'
    },
    [SupportedFieldsEnum.PassCode]: {
        // permanent: false,
        type: 'passwordNumeric',
        label: 'Passcode',
        autocorrect: '0000   ?',
        maxContent: '0000'
    }
}
