import { FetchRequestMethodEnum } from '../enums'

export interface IProxyOption {
    url: string
    method: FetchRequestMethodEnum
    data?: any,
    authToken?: string
}
