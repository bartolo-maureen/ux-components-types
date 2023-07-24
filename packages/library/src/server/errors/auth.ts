import { ServerErrorCodeEnum } from './types'

export class InvalidAuthError extends Error {
    constructor() {
        super(ServerErrorCodeEnum.INVALID_AUTH)
    }
}

export class StepUpRequiredError extends Error {
    constructor() {
        super(ServerErrorCodeEnum.STEP_UP_REQUIRED)
    }
}
