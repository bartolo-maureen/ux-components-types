import { ClientErrorCodeEnum } from './types'

export class FormNotEmptyError extends Error {
    constructor(message?: string) {
        super(`${ClientErrorCodeEnum.FORM_NOT_EMPTY}: ${message}`)
    }

}

export class FormNotFoundError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.FORM_NOT_FOUND)
    }
}

export class NameInUseError extends Error {
    constructor(message?: string) {
        super(`${ClientErrorCodeEnum.NAME_IN_USE}: ${message}`)
    }
}

export class NameRequiredError extends Error {
    constructor() {
        super(ClientErrorCodeEnum.NAME_REQUIRED)
    }
}
