import { HashParamTypeEnum } from '../enums'

export interface IHashParam {
    type?: HashParamTypeEnum

    [k: string]: any
}
