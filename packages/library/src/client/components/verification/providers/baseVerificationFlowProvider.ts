import { VerificationFlowOptionValidator } from './validators/verificationFlowOptionValidator'
import { VerificationFlowProvidersEnum } from './types'
import { IKyiResponse } from '../types/interfaces/IKyiResponse'

export abstract class BaseVerificationFlowProvider {
    options: VerificationFlowOptionValidator

    type: VerificationFlowProvidersEnum

    kyiParams: IKyiResponse

    constructor(
        kyiParams: IKyiResponse,
        options?: VerificationFlowOptionValidator
    ) {
        this.kyiParams = kyiParams
        this.options = options || new VerificationFlowOptionValidator()
    }

    protected abstract launch(selector: string): void

    protected abstract load(): Promise<any>

    public async mount(selector: string) {
        await this.load()
        this.launch(selector)

        return this;
    }

    public abstract onMessage(
        type: any,
        payload?: any
    ): void
}
