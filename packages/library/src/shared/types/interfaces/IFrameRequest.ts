import { Deferred } from '../../deferred'

export interface IFrameRequest {
  [key: string]: Deferred<(value?: any) => void>
}
