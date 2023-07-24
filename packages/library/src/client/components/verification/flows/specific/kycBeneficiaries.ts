import { BaseVerificationFlow } from '../baseVerificationFlow'
import { BaseVerificationFlowProvider } from '../../providers/baseVerificationFlowProvider'
import { IKyiResponse } from '../../types/interfaces/IKyiResponse'
import { KyiParamsGetOptionValidator } from '../validators/kyiParamsGetOptionValidator'
import { ActionTypeEnum } from '@/shared/types'
import { SumSub } from '../../providers/sumsub/sumSub'
import { SumSubOptionValidator } from '../../providers/sumsub/sumSubOptionValidator'

export class KYCBeneficiaries extends BaseVerificationFlow<SumSubOptionValidator> {


    protected launch(
        selector: string,
        options: SumSubOptionValidator,
        kyiParams: IKyiResponse,
    ): BaseVerificationFlowProvider {
        const sumSub = new SumSub(kyiParams, options)
        sumSub.mount(selector)

        return sumSub
    }


    protected getParams(): Promise<IKyiResponse> {
        const params = new KyiParamsGetOptionValidator({
            referenceId: this.referenceId,
        })

        return this.manager.action(ActionTypeEnum.BeneficiariesParamsGet, params)
    }
}
