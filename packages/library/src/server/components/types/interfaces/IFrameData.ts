import { SupportedFieldsEnum } from '../../elements/types'

export interface IFrameData {
    name: string
    field: SupportedFieldsEnum
    value: string
}

export type IFramesData = IFrameData[]
