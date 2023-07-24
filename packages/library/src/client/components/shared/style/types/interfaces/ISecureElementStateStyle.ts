import { ISecureElementStyleWithPseudoClass } from './ISecureElementStyleWithPseudoClass'

export interface ISecureElementStateStyle {
    base?: ISecureElementStyleWithPseudoClass
    empty?: ISecureElementStyleWithPseudoClass
    valid?: ISecureElementStyleWithPseudoClass
    invalid?: ISecureElementStyleWithPseudoClass
}


export type SecureElementStateStyleContract = ISecureElementStateStyle
