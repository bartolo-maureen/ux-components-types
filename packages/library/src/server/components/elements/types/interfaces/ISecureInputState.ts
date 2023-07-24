import { ISecureElementStyleFont } from '@/shared/types'
import { ISecureElementStyleWithPseudoClass } from '@/client/components/shared/style/types'
import { IValueMeta } from './IValueMeta'

export interface ISecureInputState {
    rtl?: boolean
    wait?: boolean
    fonts?: ISecureElementStyleFont[]
    placeholder?: string
    maxlength?: number
    style?: {
        base?: ISecureElementStyleWithPseudoClass
        empty?: ISecureElementStyleWithPseudoClass
        valid?: ISecureElementStyleWithPseudoClass
        invalid?: ISecureElementStyleWithPseudoClass
    }
    formatted?: string[]
    active?: string
    value?: string
    selection?: {
        start: number
        end: number
    }
    meta?: IValueMeta[]
    dirty?: boolean
    focused?: boolean
    empty?: boolean
    valid?: boolean
    invalid?: boolean
    disabled?: boolean
}
