import { ISecureClientOption } from './types'
import { CaptureComponents } from './components/capture/captureComponents'
import { DisplayComponents } from './components/display/displayComponents'
import { ActionTypeEnum, IAssociateActionData } from '@/shared/types'
import { ClientFramesManager } from './frame/clientFramesManager'
import { SecureForm } from './components/form/secureFormComponent'

export class WeavrComponents {

    protected uiKey: string

    protected options: ISecureClientOption | null = null

    protected authToken: string | null = null

    protected manager: ClientFramesManager

    protected captureComponents: CaptureComponents

    protected displayComponents: DisplayComponents

    constructor(
        uiKey: string,
        options: ISecureClientOption
    ) {
        this.manager = ClientFramesManager.getInstance()

        this.uiKey = uiKey
        this.options = options

        this.captureComponents = new CaptureComponents(uiKey, options)
        this.displayComponents = new DisplayComponents(options)
    }

    public setUserToken(
        authToken?: string,
        resolve?: () => void,
        reject?: (err?: any) => {}
    ) {
        this.authToken = authToken

        this.captureComponents.setAuthToken(authToken)

        const _data: IAssociateActionData = authToken ? { authToken: authToken } : {}
        const promise = this.manager.action(ActionTypeEnum.Associate, _data)
        if (typeof resolve === 'function') {
            promise.then(resolve)
        }
        if (typeof reject === 'function') {
            promise.catch(reject)
        }
        return promise
    }

    get capture(): CaptureComponents {
        return this.captureComponents
    }

    get display(): DisplayComponents {
        return this.displayComponents
    }

    public form() {
        return new SecureForm()
    }

    public updateOptions (options: ISecureClientOption) {
        Object.assign(this.options, options)
    }
}
