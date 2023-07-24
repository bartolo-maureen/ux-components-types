import { ActionTypeEnum, ISecureElementStyleFont } from '@/shared/types'

export interface IFramePayload {
    frameId?: string
    formId?: string
    field?: string
    token?: string
    event?: string
    data?: any
    type?: ActionTypeEnum
    nonce?: string
    result?: any
    error?: string
    rtl?: boolean,
    fonts?: ISecureElementStyleFont[]
}
