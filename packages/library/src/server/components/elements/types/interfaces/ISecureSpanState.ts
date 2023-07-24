import { ISecureElementStyleFont } from '@/shared/types'
import { ISecureElementStyleWithPseudoClass } from '@/client/components/shared/style/types'

export interface ISecureSpanState {
    value?: string
    rtl?: boolean
    wait?: boolean
    fonts?: ISecureElementStyleFont[]
    style?: {
        base?: ISecureElementStyleWithPseudoClass
    }
}
