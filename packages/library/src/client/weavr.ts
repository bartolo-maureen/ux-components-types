import { ISecureClientOption } from './types'
import { ClientFramesManager } from './frame/clientFramesManager'
import { ActionTypeEnum, FrameActionEnum, ISecureElementStyleFonts, ISecureElementStyleFontSrcs } from '@/shared/types'
import { Utils } from '@/shared/utils'
import { WeavrComponents } from './weavrComponents'
import { CaptureComponents } from './components/capture/captureComponents'
import { DisplayComponents } from './components/display/displayComponents'
import { AlreadyInitialisedError, NotInitialisedError, UIKeyRequiredError } from './errors'
import { IInitActionData } from '@/server/types'

export class Weavr {
    protected uiKey: string | null = null

    protected options: ISecureClientOption | null = null

    protected manager: ClientFramesManager

    protected static weavrComponents: WeavrComponents

    constructor() {
        this.manager = ClientFramesManager.getInstance()
    }

    init(
        uiKey: string,
        options?: ISecureClientOption
    ) {
        if (!uiKey || (typeof uiKey !== 'string')) {
            throw new UIKeyRequiredError()
        }

        if (this.isInitialised) {
            throw new AlreadyInitialisedError()
        }

        this.uiKey = uiKey
        this.options = Utils.filterProperties(options, [ 'fonts' ])

        const fonts = this.options.fonts || []
        const fontsNoCssSrc = fonts.filter(font => !('cssSrc' in font) || (typeof font['cssSrc'] !== 'string')) as ISecureElementStyleFonts

        const _data: IInitActionData = {
            uiKey: this.uiKey,
            fonts: fontsNoCssSrc
        }

        this.manager.action(
            ActionTypeEnum.Init,
            _data
        ).catch(e => {
            throw e
        })


        const fontsWithCssSrc: ISecureElementStyleFontSrcs = fonts.filter(font => ('cssSrc' in font) && (typeof font['cssSrc'] === 'string')) as ISecureElementStyleFontSrcs

        const _commonOptions = {
            fonts: fontsNoCssSrc || []
        }

        const _weavrComponents = new WeavrComponents(uiKey, this.options)

        if (fontsWithCssSrc.length) {
            this.manager.action(ActionTypeEnum.FetchFont, fontsWithCssSrc)
                .then(fonts => {
                    if (fonts.length) {
                        _commonOptions.fonts = _commonOptions.fonts.concat(fonts)
                        _weavrComponents.updateOptions(_commonOptions)
                    }
                    this.sendOrQueueReadyAction()
                })
                .catch(e => {
                    this.onErrorOccurred(e)
                })
        } else {
            if (_commonOptions.fonts.length) {
                _weavrComponents.updateOptions(_commonOptions)
            }
            this.sendOrQueueReadyAction()
        }

        Weavr.weavrComponents = _weavrComponents
        return _weavrComponents
    }

    protected onErrorOccurred(e: Error) {
        window.console && console.error(e.message)
        this.sendOrQueueReadyAction()
    }

    protected sendOrQueueReadyAction() {
        this.manager.rootFrame.sendOrQueue({ action: FrameActionEnum.Ready, payload: {} })
    }

    public setUserToken(
        authToken?: string,
        resolve?: () => void,
        reject?: (err?: any) => {}
    ): Promise<any> {
        if (!this.isInitialised) {
            throw new NotInitialisedError()
        }

        return Weavr.weavrComponents.setUserToken(authToken, resolve, reject)
    }

    get capture(): CaptureComponents {
        if (!this.isInitialised) {
            throw new NotInitialisedError()
        }

        return Weavr.weavrComponents.capture
    }

    get display(): DisplayComponents {
        if (!this.isInitialised) {
            throw new NotInitialisedError()
        }

        return Weavr.weavrComponents.display
    }

    get isInitialised() {
        return !!this.uiKey && !!Weavr.weavrComponents
    }

    public form() {
        return Weavr.weavrComponents.form()
    }
}
