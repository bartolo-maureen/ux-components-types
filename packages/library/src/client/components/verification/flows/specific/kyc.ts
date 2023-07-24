import { BaseVerificationFlow } from '../baseVerificationFlow'
import { SumSub } from '../../providers/sumsub/sumSub'
import { IKyiResponse } from '../../types/interfaces/IKyiResponse'
import { SumSubOptionValidator } from '../../providers/sumsub/sumSubOptionValidator'

export class KYC extends BaseVerificationFlow<SumSubOptionValidator> {
    launch(
        selector: string,
        options: SumSubOptionValidator,
        kyiParams: IKyiResponse,
    ): SumSub {
        const sumSub = new SumSub(kyiParams, options)
        sumSub.mount(selector)

        return sumSub
    }
}
