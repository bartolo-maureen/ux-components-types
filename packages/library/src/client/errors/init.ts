import { ClientErrorCodeEnum } from './types'

export class AlreadyInitialisedError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.ALREADY_INITIALISED)
    }
}

export class NotInitialisedError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.NOT_INITIALISED)
    }

}

export class UIKeyRequiredError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.UI_KEY_REQUIRED)
    }
}
