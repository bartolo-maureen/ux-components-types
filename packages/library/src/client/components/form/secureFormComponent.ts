import { ISecureInputOption } from '../capture/types'
import { PasswordInputComponent } from '../capture/passwordInputComponent'
import { CardPinInputComponent } from '../capture/cardPinInputComponent'
import { PassCodeInputComponent } from '../capture/passCodeInputComponent'
import { ClientFramesManager } from '../../frame/clientFramesManager'
import { ActionTypeEnum } from '@/shared/types'
import { UID } from '@/shared/restrict/uid'
import { SecureFormManager } from './secureFormManager'
import { NameInUseError, NameRequiredError } from '../../errors'

export class SecureForm {
    public readonly id: string

    constructor() {
        this.id = UID.getInstance().next('form')
        SecureFormManager.create(this)
    }

    protected checkForValidName(name: string) {
        if (!name || typeof name !== 'string') throw new NameRequiredError()
        if (SecureFormManager.hasInput(this.id, name))
            throw new NameInUseError(
                'Input with name ' + name + ' already created for this form'
            )
    }

    get manager() {
        return ClientFramesManager.getInstance()
    }

    public password(
        name: string,
        options?: ISecureInputOption
    ): PasswordInputComponent {
        this.checkForValidName(name)

        return window.weavr.capture.password(name, options, this.id)
    }

    public cardPin(
        name: string,
        options?: ISecureInputOption
    ): CardPinInputComponent {
        this.checkForValidName(name)

        return window.weavr.capture.cardPin(name, options, this.id)
    }

    public passCode(
        name: string,
        options?: ISecureInputOption
    ): PassCodeInputComponent {
        this.checkForValidName(name)

        return window.weavr.capture.passCode(name, options, this.id)
    }

    public match(inputNames?: string[]): Promise<boolean> {
        const promise = this.manager.action(ActionTypeEnum.Match, {
            formId: this.id,
            inputNames
        })
        return promise
    }

    createToken(
        resolve?: (tokens: { [key: string]: string }) => void,
        reject?: (e?: any) => void
    ) {
        const promise = this.manager.action(ActionTypeEnum.Tokenize, {
            formId: this.id
        })
        if (typeof resolve === 'function') {
            promise.then(resolve)
        }
        if (typeof reject === 'function') {
            promise.catch(reject)
        }
        return promise
    }

    destroy(): this {
        SecureFormManager.delete(this)
        return this
    }
}
