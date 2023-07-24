import { SecureBaseServer } from '../base/secureBaseServer'
import { RootUpdateOptionValidator } from '../../rootUpdateOptionValidator'
import { FIELD_UTILS } from '@/server/utils/fieldUtils'
import { SecureSpanUserUpdateOptionValidator } from './secureSpanUserUpdateOptionValidator'
import { SecureSpanOptionValidator } from './secureSpanOptionValidator'
import { Utils } from '@/shared/utils'
import { ISecureSpanState, ServerEventEnum, SUPPORTED_FIELDS } from '../types'
import {ISecureSpanServer} from "@/server/components/elements/types/interfaces/ISecureSpanServer";

export class SecureSpan extends SecureBaseServer {
    declare state: ISecureSpanState
    private width: number
    private height: number
    private elements: ISecureSpanServer
    private lastMessage: any
    private controllerListeners: {
        [key: string]: (...args: any[]) => void
    } = {}

    constructor(options: SecureSpanOptionValidator) {
        super(options)

        this.updateDimensions = this.updateDimensions.bind(this)

        this.state = this.setStateFromOptions(options)

        this.width = 0
        this.height = 0

        this.controllerListeners[ServerEventEnum.RootUpdate] = event => {
            if (Object.keys(event).length) {
                const options = new RootUpdateOptionValidator(event)
                options.validate().then(() => {
                    this.setState(this.setStateFromOptions(options))
                })
            }
        }

        this.controllerListeners[ServerEventEnum.RootInit] = () => {
            this.setState({
                wait: false
            }, () => this.event('ready'))
        }

        this.controllerListeners[ServerEventEnum.UserMount] = event => {
            event.rtl !== this.state.rtl && this.setState({
                rtl: event.rtl
            })
        }

        this.controllerListeners[ServerEventEnum.UserUpdate] = event => {
            if (Object.keys(event).length) {
                const options = new SecureSpanUserUpdateOptionValidator(event)
                options.validate().then(() => {
                    this.setState(this.setStateFromOptions(options))
                })
            }
        }


        this.load()

        Object.keys(this.controllerListeners)
            .forEach(key => this.eventEmitter.addListener(key, this.controllerListeners[key]))

        this.render()
    }


    private updateDimensions() {
        const size = this.elements ? this.elements.span.getBoundingClientRect() : { width: 0, height: 0 }
        if ((this.width !== size.width) || (this.height !== size.height)) {
            this.event('dimensions', {
                width: size.width,
                height: size.height
            })
            this.width = size.width
            this.height = size.height
        }
        this.REQUEST_FRAME_HANDLER()(this.updateDimensions.bind(this))
    }

    private setStateFromOptions(options: SecureSpanOptionValidator | RootUpdateOptionValidator | SecureSpanUserUpdateOptionValidator): ISecureSpanState {
        const rest = options.get([ 'wait', 'rtl', 'style' ])
        const state = this.state || Object.assign({}, this.DEFAULT_STATE)

        if (options instanceof RootUpdateOptionValidator) {
            return this.updateIframeHeadFontStyleSheet(state, options)
        }

        if (!(options instanceof SecureSpanUserUpdateOptionValidator)) {
            const fonts = options.fonts ? [].concat(state.fonts, options.fonts) : state.fonts
            return Object.assign(state, rest, {
                fonts: fonts
            })
        }

        if (options.withOverride) {
            return this.getNewOptions(rest)
        }

        /**
         * since options is an instanceof SecureSpanUserUpdateOptions then we update the object with the new data
         * This is used to trigger dynamic user updates
         */
        return Utils.mergeObjectsDeep(state, rest)

    }

    private getNewOptions(_options: ISecureSpanState) {
        return Object.assign({}, _options)
    }

    DEFAULT_STATE: ISecureSpanState = {
        wait: false,
        value: '',
        rtl: false,
        fonts: []
    }

    protected requestHandler = (
        payload: any,
        resolve: (result?: any) => void,
        reject: (e?: any) => void
    ) => {
        if (payload.error) {
            this.event('error', payload.error)
            reject(payload.error)
            return
        }
        if (payload.value) {
            this.value = payload.value
        }
        resolve()
    }

    protected get value(): any {
        return {}
    }

    protected set value(value) {
        const autocorrect = this.options.autocorrect || SUPPORTED_FIELDS[this.fieldType].autocorrect
        if (autocorrect) {
            const formatted = FIELD_UTILS.autocorrect(autocorrect, value.data.value).formatted
            this.setState({
                value: formatted
            })
        } else {
            this.setState({
                value: value.data.value
            })
        }
        this.event('change', {})
    }


    render() {
        let append = false
        if (!this.elements) {
            append = true

            const div = document.createElement('div')
            div.className = 'secure-element'

            this.createIframeHeadFontStyleSheet()

            const secureElementInnerStyleSheet = this.setSecureElementInnerStyleSheet()

            const span = document.createElement('span')
            span.className = 'secure-element__element'

            div.appendChild(secureElementInnerStyleSheet)
            div.appendChild(span)

            this.elements = {
                div: div,
                style: secureElementInnerStyleSheet,
                span: span
            }

        } else {
            this.reRenderSecureElementStyle()
        }

        if (this.state.wait) {
            this.elements.div.setAttribute('style', 'visibility: hidden')
        } else {
            this.elements.div.removeAttribute('style')
        }
        this.elements.div.dir = this.state.rtl ? 'rtl' : 'ltr'

        this.elements.span.innerHTML = this.state.value

        append && document.body.appendChild(this.elements.div)

        this.updateDimensions()
    }

    private reRenderSecureElementStyle() {
        if (this.options.style) {
            this.elements.style.innerHTML = `${FIELD_UTILS.renderStyleCss(this.state.style)}`
        }
    }

}
