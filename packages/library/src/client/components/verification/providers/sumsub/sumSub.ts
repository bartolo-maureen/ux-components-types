import { VerificationFlowProvidersEnum } from '../types'
import { Config } from '@/shared/config'
import { BaseVerificationFlowProvider } from '../baseVerificationFlowProvider'
import { Deferred } from '@/shared/deferred'
import { SumSubOptionValidator } from './sumSubOptionValidator'
import { IKyiResponse } from '../../types/interfaces/IKyiResponse'
import { SUM_SUB_LOCATISATION_SOLE_TRADER } from './sumSubLocalisation'

export class SumSub extends BaseVerificationFlowProvider {
    declare options: SumSubOptionValidator

    type = VerificationFlowProvidersEnum.SUMSUB

    constructor(
        kyiParams: IKyiResponse,
        options: SumSubOptionValidator
    ) {
        super(kyiParams, options)

        this.options = options

        if (options.onError) {
            this.onError = options.onError
        }
    }

    protected load() {
        const deferred = new Deferred<(value?: any) => void>()

        let script = document.createElement('script')
        script.onload = function () {
            deferred.resolve()
        }.bind(this)
        script.src = Config.providers.sum_sub.url

        document.head.appendChild(script)

        return deferred.promise
    }

    protected launch(selector: string): void {
        let config = {
            lang: this.options.lang || 'en',
            email: this.options?.email,
            mobile: this.options?.mobile,
            onMessage: this.onMessage,
            onError: this.onError,
            uiConf: {
                customCss: this.options.customCss,
                customCssStr: this.options.customCssStr,
            },
            clientId: 'weavr',
            i18n: this.kyiParams.params.verificationFlow === 'corporate-sole-trader-flow' ? SUM_SUB_LOCATISATION_SOLE_TRADER : null,
        }

        // @ts-ignore
        let snsWebSdkConfig = snsWebSdk.init(
            this.kyiParams.params.accessToken,
            (newAccessTokenCallback: any) => {
                // Access token expired
                // get a new one and pass it to the callback to re-initiate the WebSDK
                let newAccessToken = this.kyiParams.params.accessToken; // get a new token from your backend
                if (typeof newAccessTokenCallback === 'function') newAccessTokenCallback(newAccessToken)
            })
            .withConf(config)
            .onMessage(this.onMessage.bind(this))
            .on('onError', this.onError.bind(this))

        const snsWebSdkInstance = snsWebSdkConfig.build()

        // you are ready to go:
        // just launch the WebSDK by providing the container element for it
        snsWebSdkInstance.launch(selector)
    }

    public onError(error: any): void {
        console.error('WebSDK onError', error)
    }

    public onMessage(
        type: any,
        payload: any
    ): void {
        if (!this.options.onMessage) return

        if (type === 'idCheck.onApplicantSubmitted') {
            this.options.onMessage('kycSubmitted')
        } else if (type === 'idCheck.applicantStatus') {
            const reviewAnswer = payload?.reviewResult?.reviewAnswer
            switch (reviewAnswer) {
                case 'GREEN':
                    this.options.onMessage('kycApproved')
                    break
                case 'RED':
                    this.options.onMessage('kycRejected')
                    break
            }
        }
    }
}
