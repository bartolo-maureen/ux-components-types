import { ClientFramesManager } from '@/client/frame/clientFramesManager'
import { ActionTypeEnum } from '@/shared/types'
import { BaseVerificationFlowProvider } from '../providers/baseVerificationFlowProvider'
import { VerificationFlowOptionValidator } from '../providers/validators/verificationFlowOptionValidator'
import { KyiParamsGetOptionValidator } from './validators/kyiParamsGetOptionValidator'
import { IKyiResponse } from '../types/interfaces/IKyiResponse'

export abstract class BaseVerificationFlow<T = VerificationFlowOptionValidator> {
    uiKey: string
    referenceId: string
    authToken?: string

    constructor(
        uiKey: string,
        referenceId: string,
        authToken?: string,
    ) {
        this.uiKey = uiKey
        this.referenceId = referenceId
        this.authToken = authToken
    }

    protected abstract launch(
        selector: string,
        options: T,
        kyiParams: IKyiResponse
    ): BaseVerificationFlowProvider

    public async mount(
        selector: string,
        options: T
    ): Promise<BaseVerificationFlowProvider> {
        const res = await this.getParams()
        return this.launch(selector, options, res)
    }

    protected getParams(): Promise<IKyiResponse> {
        const params = new KyiParamsGetOptionValidator({
            referenceId: this.referenceId,
            authToken: this.authToken
        })

        return this.manager.action(ActionTypeEnum.KyiParamsGet, params)
    }

    protected get manager() {
        return ClientFramesManager.getInstance()
    }


}
