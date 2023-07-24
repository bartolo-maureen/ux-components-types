import { BaseVerificationFlow } from '../baseVerificationFlow'
import { SumSubOptionValidator } from '../../providers/sumsub/sumSubOptionValidator'
import { IKyiResponse } from '../../types/interfaces/IKyiResponse'
import { SumSub } from '../../providers/sumsub/sumSub'

export class KYB extends BaseVerificationFlow<SumSubOptionValidator> {
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
