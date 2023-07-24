import { ISecureClientOption } from '@/client/types'
import { ISecureSpanElementStyleWithPseudoClass } from '../../../shared/style/types'

export interface ISecureSpanOption {
    className?: string
    autocorrect?: string
    style?: ISecureSpanElementStyleWithPseudoClass
}


export interface ISecureSpanOptionsWithSecureClientOption extends ISecureSpanOption, ISecureClientOption {
}
