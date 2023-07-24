import { ServerErrorCodeEnum } from './types'

export class InternalError extends Error {
    constructor() {
        super(ServerErrorCodeEnum.INTERNAL_ERROR)
    }
}
