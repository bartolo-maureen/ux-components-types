import { ISecureElementStateStyle, ISecureInputOptionsStyleClass } from '../../../shared/style/types'
import { SecureInputValidationModeEnum } from '../index'

export interface ISecureInputOption {
    classNames?: ISecureInputOptionsStyleClass
    placeholder?: string
    maxlength?: number
    autocorrect?: string
    disabled?: boolean
    style?: ISecureElementStateStyle
    validationMode?: SecureInputValidationModeEnum
    segmented?: boolean
}
