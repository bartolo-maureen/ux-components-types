import { FrameActionEnum } from '@/shared/types'
import { IFramePayload } from './IFramePayload'

export interface IFrameMessage {
    id?: string
    action: FrameActionEnum
    payload: IFramePayload
}

export type IFramesMessage = IFrameMessage[]
