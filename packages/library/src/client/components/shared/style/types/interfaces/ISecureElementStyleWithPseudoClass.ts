import { ISecureElementStyle } from './ISecureElementStyle'

export interface ISecureElementStyleWithPseudoClass extends ISecureElementStyle {
    ':hover'?: Omit<ISecureElementStyleWithPseudoClass, ':hover'>
    ':active'?: Omit<ISecureElementStyleWithPseudoClass, ':active'>
    ':disabled'?: Omit<ISecureElementStyleWithPseudoClass, ':disabled'>
    ':focus'?: Omit<ISecureElementStyleWithPseudoClass, ':focus'>
    '::placeholder'?: Omit<ISecureElementStyleWithPseudoClass, '::placeholder'>
    '::selection'?: Omit<ISecureElementStyleWithPseudoClass, '::selection'>
    ':-webkit-autofill'?: Omit<ISecureElementStyleWithPseudoClass, ':-webkit-autofill'>
}


export type ISecureSpanElementStyleWithPseudoClass = Omit<ISecureElementStyleWithPseudoClass, ':active' | ':disabled' | ':focus' | '::placeholder' | '::selection' | ':-webkit-autofill'>

export type SecureElementStyleWithPseudoClassContract = ISecureElementStyleWithPseudoClass
