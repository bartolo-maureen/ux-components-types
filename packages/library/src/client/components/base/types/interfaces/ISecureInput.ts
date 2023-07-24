import { ISecureInputOptionsStyleClass } from '../../../shared/style/types'
import { ISecureElement } from '../../secureElement/types'

export interface ISecureInput extends ISecureElement {
    classes: ISecureInputOptionsStyleClass,
    focused: boolean,
    empty: boolean,
    invalid: boolean,
    valid: boolean,
    disabled: boolean,
    autofilled: boolean,
    focusListener?: () => void
    fakeInput?: HTMLInputElement,
    label?: HTMLLabelElement,
    lastBackgroundColor?: string,
    formId?: string
}
