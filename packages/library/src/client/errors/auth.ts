import { ClientErrorCodeEnum } from './types'

export class AuthRequiredError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.AUTH_REQUIRED)
    }
}
