import { FrameCommunication } from '@/shared/comms'
import { Utils } from '@/shared/utils'
import { Config } from '@/shared/config'
import {
    ActionTypeEnum,
    FrameActionEnum,
    IActionData,
    IAssociateActionData,
    IFrameRequest,
    ISecureElementStyleFont,
    ISecureElementStyleFonts,
    ISecureElementStyleFontSrc,
    ISecureElementStyleFontSrcs
} from '@/shared/types'
import { UID } from '@/shared/restrict/uid'
import { Deferred } from '@/shared/deferred'
import { IInitActionData } from '../types'
import { IFramesData, IMatchActionData, ITokenizeActionData, ITokenizeFormActionData } from './types'
import {
    KyiParamsGetOptionValidator
} from '@/client/components/verification/flows/validators/kyiParamsGetOptionValidator'
import { InvalidFontsError } from '../errors'
import { ServerFrame } from '../frame'
import { API } from '../services'
import { FetchRequestMethodEnum, IProxyOption } from '../services/types'
import { IFrameMessage } from '../frame/types'
import { SUPPORTED_FIELDS, SUPPORTED_INPUT_FIELD_STRING_MAPPING, SUPPORTED_INPUT_FIELDS } from './elements/types'


export class Root extends FrameCommunication {
    FONT_PROPS = {
        'font-family': 'family',
        src: 'src',
        'font-display': 'display',
        'font-style': 'style',
        'unicode-range': 'unicodeRange',
        'font-weight': 'weight',
        'font-variant': 'variant',
        'font-stretch': 'stretch'
    }
    protected ready: boolean = false
    protected uiKey: string
    private fonts: ISecureElementStyleFonts = []
    private frames: { [key: string]: ServerFrame } = {}
    private requests: IFrameRequest = {}

    constructor() {
        super()
        window.addEventListener('message', (message) => {
            const parsed = this.parseMessage(message.data)

            const isRootReport =
                parsed && parsed.action === FrameActionEnum.RootReport
            const isHandleSecure = Utils.compareOrigins(
                Config.base.secure_origin,
                message.origin !== 'null' ? message.origin : null
            )

            console.debug(isRootReport, isHandleSecure, parsed)

            if (isRootReport) {
                console.debug(parsed.payload.event, parsed.payload.data)
            } else if (isHandleSecure) {
                this.handleSecure(parsed)
            } else {
                this.handleParent(parsed)
            }
        })

        this.sendParentFrameMessage({
            action: FrameActionEnum.RootLoad,
            payload: {}
        })

        console.debug('controller.load')
    }

    get api() {
        return API.getInstance()
    }

    public createInput(message: IFrameMessage) {
        this.frames[message.payload.frameId] = new ServerFrame(
            message.payload.frameId,
            true,
            [],
            Utils.getWindowByName(window.parent, message.payload.frameId),
            message.payload.formId
        )

        this.updateFrameFontFaces(message.payload.frameId)

    }

    parseCssProp(
        cssProp: string,
        fontSrc: string
    ): { [key: string]: string } {
        const colonIndex = cssProp.indexOf(':')
        if (colonIndex === -1) {
            // 'Invalid css declaration in file from ' + fontSrc + ': \'' + cssProp + '\''
            throw new InvalidFontsError()
        }
        const cssKey = cssProp.slice(0, colonIndex).trim()
        if (!(this.FONT_PROPS as any)[cssKey]) {
            // 'Unsupported css property in file from ' + fontSrc + ': \'' + cssKey + '\''
            throw new InvalidFontsError()
        }
        const prop: { [key: string]: string } = {}
        prop[(this.FONT_PROPS as any)[cssKey]] = cssProp
            .slice(colonIndex + 1)
            .trim()
        return prop
    }

    retrieveFormData(
        formId: string,
        resolve?: (data: IFramesData) => void,
        reject?: (e?: any) => void
    ) {
        const formData = {
            count: 0,
            frames: [] as ServerFrame[],
            data: [] as IFramesData,
            errors: {} as any
        }

        Object.keys(this.frames).forEach((key) => {
            const frame = this.frames[key]

            if (formId === frame.formId) {
                formData.count++
                formData.frames.push(frame)
            }
        })

        formData.frames.forEach((frame) => {
            this.elementRequest(frame, {})
                .then((data) => {
                    formData.data.push(data)
                    formData.count--
                    if (!formData.count) {
                        if (Object.keys(formData.errors).length) {
                            reject(formData.errors)
                        } else {
                            resolve(formData.data)
                        }
                    }
                })
                .catch((e) => {
                    formData.errors[frame.id] = e.message
                    formData.count--
                    if (!formData.count) {
                        reject(formData.errors)
                    }
                })
        })
    }

    retrieveFrameData(
        frameId: string,
        resolve?: (data: IFramesData) => void,
        reject?: (e?: any) => void
    ) {
        const frame = this.frames[frameId]
        if (frame) {
            this.elementRequest(frame, {})
                .then((data) => resolve([ data ]))
                .catch((e) => reject(e.message))
        }
    }

    public sendParentFrameMessage(message: IFrameMessage) {
        window.parent.postMessage(
            JSON.stringify(
                Object.assign({}, message, {
                    id: Config.frames.id_prefix + 'root',
                    [Config.frames.unique_comms_channel]: true
                })
            ),
            '*'
        )
    }

    protected handleParent(message: IFrameMessage) {
        console.log('handleParent', message.action)
        switch (message.action) {
            case FrameActionEnum.Ready:
                this.handleReady()
                break
            case FrameActionEnum.CreateInput:
                this.createInput(message)
                break
            case FrameActionEnum.CreateSpan:
                this.createSpan(message)
                break
            case FrameActionEnum.Destroy:
                this.destroy(message)
                break
            case FrameActionEnum.RootAction:
                this.rootAction(message)
                break
        }
    }

    protected handleSecure(message: IFrameMessage) {
        if (message && message.id && this.frames[message.id])
            switch (message.action) {
                case FrameActionEnum.ElementLoad:
                    this.elementLoad(message)
                    break
                case FrameActionEnum.ElementRequestComplete:
                    this.elementRequestComplete(message)
                    break
                case FrameActionEnum.ElementRequestError:
                    this.elementRequestError(message)
                    break
            }
    }

    protected handleReady() {
        if (!this.ready) {
            this.ready = true
            Object.keys(this.frames).forEach((key) => {
                const _frame = this.frames[key]
                _frame.sendOrQueue({
                    action: FrameActionEnum.RootInit,
                    payload: {}
                })
            })
        }
    }

    protected createSpan(message: IFrameMessage) {
        const _frame = new ServerFrame(
            message.payload.frameId,
            true,
            [],
            Utils.getWindowByName(window.parent, message.payload.frameId)
        )

        this.frames[message.payload.frameId] = _frame
        let field = SUPPORTED_FIELDS[message.payload.field]
        this.api
            .detokenize(field, message.payload.token)
            .then((data) => {
                this.elementRequest(_frame, { value: data })
            })
            .catch((e) => {
                this.elementRequest(_frame, { error: e?.message })
            })
    }

    protected destroy(message: IFrameMessage) {
        delete this.frames[message.payload.frameId]
    }

    protected rootAction(message: IFrameMessage) {
        if (message.payload.type && message.payload.nonce) {
            this.action(
                message.payload.type,
                message.payload.nonce,
                message.payload.data
            )
        }
    }

    protected elementLoad(message: IFrameMessage) {
        const lframe = this.frames[message.id]
        if (lframe) {
            lframe.setLoaded()
            lframe.queuedMessages.forEach((message) =>
                lframe.sendOrQueue(message)
            )
            lframe.queuedMessages = []

            if (this.ready) {
                lframe.sendOrQueue({
                    action: FrameActionEnum.RootInit,
                    payload: {}
                })
            }
        }
    }

    protected elementRequest(
        frame: ServerFrame,
        data?: any
    ): Promise<any> {
        const nonce = UID.getInstance().next('request')

        this.requests[nonce] = new Deferred<(value?: any) => void>()

        frame.sendOrQueue({
            action: FrameActionEnum.ElementRequest,
            payload: Object.assign({}, data, {
                nonce: nonce
            })
        })

        return this.requests[nonce].promise
    }

    protected elementRequestComplete(message: IFrameMessage) {
        const crequest = this.requests[message.payload.nonce]
        if (crequest) {
            delete this.requests[message.payload.nonce]
            crequest.resolve &&
            crequest.resolve(
                Object.assign({}, message.payload.result, {
                    frameId: message.id
                })
            )
        }
    }

    protected elementRequestError(message: IFrameMessage) {
        const erequest = this.requests[message.payload.nonce]
        if (erequest) {
            delete this.requests[message.payload.nonce]
            erequest.reject && erequest.reject(new Error(message.payload.error))
        }
    }

    protected action(
        type: ActionTypeEnum,
        nonce: string,
        data?: IActionData
    ): void {
        if (!type || !nonce) {
            return
        }

        data = data && typeof data === 'object' ? data : {}

        switch (type) {
            case ActionTypeEnum.Init:
                this.init(data as IInitActionData, nonce)
                break
            case ActionTypeEnum.FetchFont:
                this.fetchFont(data as ISecureElementStyleFontSrcs, nonce)
                break
            case ActionTypeEnum.Tokenize:
                this.tokenize(
                    data as
                        | ITokenizeActionData
                        | ITokenizeFormActionData,
                    nonce
                )
                break
            case ActionTypeEnum.Match:
                this.match(data as IMatchActionData, nonce)
                break
            case ActionTypeEnum.Associate:
                this.associate(data as IAssociateActionData, nonce)
                break
            case ActionTypeEnum.KyiParamsGet:
                this.kyiParamsGet(data as KyiParamsGetOptionValidator, nonce)
                break
            case ActionTypeEnum.BeneficiariesParamsGet:
                this.beneficiariesParamsGet(
                    data as KyiParamsGetOptionValidator,
                    nonce
                )
                break
            default:
                console.debug('unknown_action', { type: type, options: data })
                this.actionError(nonce, 'Unknown action: ' + type)
        }
    }

    protected init(
        data: IInitActionData,
        nonce: string
    ) {
        if (data.uiKey) {
            this.uiKey = data.uiKey
            this.fonts.push(...data.fonts)

            this.api.setUiKey(this.uiKey)
            this.actionComplete(nonce)
        }
    }

    protected actionComplete(
        nonce: string,
        result?: any
    ) {
        this.sendParentFrameMessage({
            action: FrameActionEnum.RootActionComplete,
            payload: {
                nonce: nonce,
                result: result
            }
        })
    }

    protected actionError(
        nonce: string,
        error: string
    ) {
        this.sendParentFrameMessage({
            action: FrameActionEnum.RootActionError,
            payload: {
                nonce: nonce,
                error: error
            }
        })
    }

    protected tokenize(
        data: ITokenizeActionData | ITokenizeFormActionData,
        nonce: string
    ) {
        if ('frameId' in data) {
            this.retrieveFrameData(
                data.frameId,
                this.executeTokenization(nonce),
                (e) => this.actionError(nonce, e.message)
            )
        } else if ('formId' in data) {
            this.retrieveFormData(
                data.formId,
                this.executeTokenization(nonce),
                (e) => this.actionError(nonce, e.message)
            )
        }
    }

    protected match(
        data: IMatchActionData,
        nonce: string
    ) {
        this.retrieveFormData(
            data.formId,
            this.executeMatchFormData(nonce, data.inputNames),
            (e) => this.actionError(nonce, e.message)
        )
    }

    protected kyiParamsGet(
        data: KyiParamsGetOptionValidator,
        nonce: string
    ) {
        const _data = new KyiParamsGetOptionValidator(data)
        if (_data.isValid()) {
            const options: IProxyOption = {
                url:
                    Config.base.api_url +
                    '/kyi/params/' +
                    _data.referenceId +
                    '/get',
                method: FetchRequestMethodEnum.POST,
                authToken: _data.authToken
            }
            this.proxy(options, nonce)
        }
    }

    protected beneficiariesParamsGet(
        data: KyiParamsGetOptionValidator,
        nonce: string
    ) {
        const _data = new KyiParamsGetOptionValidator(data)
        if (_data.isValid()) {
            const options: IProxyOption = {
                url:
                    Config.base.api_url +
                    '/beneficiaries/params/' +
                    _data.referenceId +
                    '/get',
                method: FetchRequestMethodEnum.POST
            }
            this.proxy(options, nonce)
        }
    }

    protected associate(
        data: IAssociateActionData,
        nonce: string
    ) {
        if (data.authToken) {
            // do api call to associate
            this.api.setAuthToken(data.authToken)
            this.api
                .associate()
                .then((response) => {
                    this.api.random = response.data.random
                    this.actionComplete(nonce)
                })
                .catch((e) => {
                    this.actionError(nonce, e.message)
                })
        } else {
            this.api.random = null
            this.actionComplete(nonce)
        }
    }

    protected proxy(
        data: IProxyOption,
        nonce: string
    ) {
        this.api
            .proxy(data)
            .then((response) => {
                this.actionComplete(nonce, response.data)
            })
            .catch((e) => {
                this.actionError(nonce, e.message)
            })
    }

    /**
     * @description Since fonts loaded via cssSrc are asynchronous it might be the case that the actual @font-face is fetched before the frame
     * is available to the instance. This will leave the frame with possibly missing @font-faces. The below will ensure that the
     * frames head stylesheet is update on frame creation with the current available @font-faces.
     *
     * In a case where the frame is created before the font is fetched. The sync will happen in the fetchFont method() for every
     * frame in the instance.
     */
    private updateFrameFontFaces(id: string) {
        if (!!this.fonts.length) {
            this.frames[id].sendOrQueue({
                action: FrameActionEnum.RootUpdate,
                payload: { fonts: this.fonts }
            })
        }
    }

    private executeTokenization(nonce: string) {
        return (data: IFramesData) => {
            // do api call to tokenize choose between anon_tok / tok based on random presence
            if (this.api.random == null) {
                this.api
                    .anon_tokenize(data)
                    .then((resp) => this.actionComplete(nonce, resp.data))
                    .catch((e) => this.actionError(nonce, e.message))
            } else {
                this.api
                    .tokenize(data)
                    .then((resp) => this.actionComplete(nonce, resp.data))
                    .catch((e) => this.actionError(nonce, e.message))
            }
        }
    }

    private executeMatchFormData(
        nonce: string,
        filteredInputNames?: string[]
    ) {
        return (data: IFramesData) => {
            const checkResult = this.matchFormData(data, filteredInputNames)
            if (!checkResult.success) {
                this.actionError(nonce, checkResult.error)
            } else {
                this.actionComplete(nonce)
            }
        }
    }

    private matchFormData(
        data: IFramesData,
        filteredInputNames?: string[]
    ) {
        const inputFrames: { [x: string]: IFramesData } = {}

        data.forEach((item) => {
            if (
                SUPPORTED_INPUT_FIELDS.includes(item.field) &&
                (!filteredInputNames || filteredInputNames.includes(item.name))
            ) {
                if (!inputFrames[item.field]) {
                    inputFrames[item.field] = []
                }
                inputFrames[item.field].push(item)
            }
        })

        const allInputTypes = Object.keys(inputFrames)
        for (let i = 0; i < allInputTypes.length; i++) {
            const inputType = allInputTypes[i]
            const inputs = inputFrames[allInputTypes[i]]
            if (inputs.length > 1) {
                const inputValue = inputs[0].value
                if (!inputs.every((input) => input.value === inputValue)) {
                    return {
                        success: false,
                        // @ts-ignore
                        error: `${SUPPORTED_INPUT_FIELD_STRING_MAPPING[inputType]} values do not match`
                    }
                }
            }
        }

        return { success: true }
    }

    private fetchFont(
        data: ISecureElementStyleFontSrcs,
        nonce: string
    ) {
        if (Array.isArray(data)) {
            let fontsToFetch = data.length
            let fetchedFonts = [] as ISecureElementStyleFonts
            data.forEach((font: ISecureElementStyleFontSrc) => {
                if (font.cssSrc && typeof font.cssSrc === 'string') {
                    let i = Date.now()
                    this.getTheFont(
                        font.cssSrc,
                        (fonts): void => {
                            console.debug('font.loaded', {
                                load_time: Date.now() - i,
                                font_count: fonts.length,
                                css_src: font.cssSrc
                            })
                            fetchedFonts = fetchedFonts.concat(fonts)

                            if (--fontsToFetch === 0) {

                                this.fonts.push(...fonts)

                                Object.keys(this.frames).forEach((_frame) =>
                                    this.frames[_frame].sendOrQueue({
                                        action: FrameActionEnum.RootUpdate,
                                        payload: {
                                            fonts: this.fonts
                                        }
                                    })
                                )

                                this.actionComplete(nonce, fonts)
                            }
                        },
                        (e) => {
                            console.debug('font.error', {
                                load_time: Date.now() - i,
                                message: e.message,
                                css_src: font.cssSrc
                            })
                            if (--fontsToFetch === 0) {
                                this.actionError(nonce, e.message)
                            }
                        }
                    )
                }
            })
        }
    }

    private getTheFont(
        fontSrc: string,
        resolve?: (fonts: ISecureElementStyleFonts) => void,
        reject?: (e?: any) => void
    ) {
        this.api
            .fetchFont(fontSrc)
            .then((res: string) => {
                try {
                    const fontFaces = res.match(/@font-face[ ]?{[^}]*}/g)
                    if (!fontFaces) {
                        // 'No @font-face rules found in file from ' + fontSrc
                        throw new InvalidFontsError()
                    }

                    resolve(
                        fontFaces.map((fontFace: string) => {
                            const fontFaceProps = fontFace.match(
                                /@font-face[ ]?{([^}]*)}/
                            ) // extract props with capturing group
                            const props = (
                                fontFaceProps ? fontFaceProps[1] : ''
                            ).match(/[^;]+(?=;)/g) // extract key=value
                            if (!props) {
                                // 'Found @font-face rule containing no valid font-properties in file from ' + fontSrc + ': ' + fontFaceProps
                                throw new InvalidFontsError()
                            }
                            const font = props.reduce(
                                    (
                                        prev,
                                        cur
                                    ) =>
                                        Object.assign(
                                            {},
                                            prev,
                                            this.parseCssProp(cur, fontSrc)
                                        ),
                                    {}
                                ) as ISecureElementStyleFont
                            ;[ 'family', 'src' ].forEach((key) => {
                                if (!(font as any)[key]) {
                                    // 'Missing css property in file from ' + fontSrc + ': \'' + (this.FONT_PROPS as any)[key] + '\''
                                    throw new InvalidFontsError()
                                }
                            })
                            return font
                        })
                    )
                } catch (e) {
                    reject(e)
                }
            })
            .catch(reject)
    }
}
