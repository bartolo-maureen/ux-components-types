import { ClientErrorCodeEnum } from './types'

export class ElementAlreadyDestroyedError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.ELEMENT_ALREADY_DESTROYED)
    }
}

export class ElementAlreadyMountedError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.ELEMENT_ALREADY_MOUNTED)
    }
}

export class InvalidSelectorError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.INVALID_SELECTOR)
    }
}

export class TokenRequiredError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.TOKEN_REQUIRED)
    }
}
