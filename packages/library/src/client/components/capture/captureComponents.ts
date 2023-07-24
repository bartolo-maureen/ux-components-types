import { ISecureClientOption } from '../../types'
import { IPasswordInputOption, ISecureInputOption } from './types'
import { PasswordInputComponent } from './passwordInputComponent'
import { CardPinInputComponent } from './cardPinInputComponent'
import { PassCodeInputComponent } from './passCodeInputComponent'
import { KYB, KYC, KYCBeneficiaries } from '../verification/flows/specific'
import { AuthRequiredError } from '../../errors'


export class CaptureComponents {
    protected uiKey: string

    protected authToken: string | null = null

    protected options: ISecureClientOption | null = null

    constructor(
        uiKey: string,
        options: ISecureClientOption
    ) {
        this.uiKey = uiKey
        this.options = options
    }

    setAuthToken(token: string) {
        this.authToken = token
    }

    public password(
        name: string,
        options?: IPasswordInputOption,
        formId?: string
    ): PasswordInputComponent {
        return new PasswordInputComponent(this.options, name, options, { formId })
    }

    public cardPin(
        name: string,
        options?: ISecureInputOption,
        formId?: string
    ): CardPinInputComponent {
        if (this.authToken === null) {
            throw new AuthRequiredError()
        }
        return new CardPinInputComponent(this.options, name, options, { formId })
    }

    public passCode(
        name: string,
        options?: ISecureInputOption,
        formId?: string
    ): PassCodeInputComponent {
        return new PassCodeInputComponent(this.options, name, options, { formId })
    }

    public consumerKyc(referenceId: string) {
        return new KYC(this.uiKey, referenceId, this.authToken)
    }

    public beneficiariesKyc(referenceId: string) {
        return new KYCBeneficiaries(this.uiKey, referenceId)
    }

    public corporateKyb(referenceId: string) {
        return new KYB(this.uiKey, referenceId, this.authToken)
    }
}
