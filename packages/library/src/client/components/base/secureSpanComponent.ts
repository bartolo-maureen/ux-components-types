import { SecureElement } from './secureElement/secureElement'
import { ElementFrameTypeEnum, ISecureClientOption } from '../../types'
import { Utils } from '@/shared/utils'
import { SecureSpanOptionValidator } from '../display/validators/secureSpanOptionValidator'
import { ISecureSpan, ISecureSpanOption, ISecureSpanOptionsWithSecureClientOption } from '../display/types'
import { FrameActionEnum } from '@/shared/types'
import { EventEmitter } from 'events'
import { UID } from '@/shared/restrict/uid'
import { Config } from '@/shared/config'
import { ISecureSpanContract } from './types'
import {
    SecureSpanUserUpdateOptionValidator
} from '@/server/components/elements/span/secureSpanUserUpdateOptionValidator'
import { SupportedFieldsEnum } from '@/server/components/elements/types'
import { TokenRequiredError } from '../../errors'

export abstract class SecureSpanComponent extends SecureElement implements ISecureSpanContract {
    name: string

    options: ISecureSpanOptionsWithSecureClientOption

    element: ISecureSpan

    abstract get field(): SupportedFieldsEnum

    token: string

    defaultCssClassName: string = 'opc-uxsec-span'

    uneditableCssClasses: string = ''

    elementDivStyle = {
        margin: '0',
        padding: '0',
        border: 'none',
        display: 'block',
        background: 'transparent',
        position: 'relative',
        opacity: '1'
    }

    constructor(
        secureClientOptions: ISecureClientOption,
        token: string,
        options?: ISecureSpanOption
    ) {
        super()

        if (!token || (typeof token !== 'string')) {
            throw new TokenRequiredError()
        }

        this.token = token

        /**
         * @description Object made up of options passed to Secure Span Constructor and merged with Secure Client Font and loaded. This object now contains
         * the font-faces defined in the secure component initializer.
         */
        const _optionsWithSecureClientOptions: ISecureSpanOptionsWithSecureClientOption & { loaded: boolean } = Object.assign({}, options, secureClientOptions, {
            loaded: this.manager.rootFrame.loaded
        })

        const _optionsWithBaseFn = new SecureSpanOptionValidator(_optionsWithSecureClientOptions)

        if (_optionsWithBaseFn.isValid()) {
            this.options = _optionsWithSecureClientOptions
            this.createSpan()
        }
    }

    createSpan() {
        this.element = {
            id: UID.getInstance().next('span'),
            field: this.field,
            eventEmitter: new EventEmitter(),
            className: this.defaultCssClassName,
            destroyed: false
        }

        this.element.eventEmitter.setMaxListeners(0)

        this.element.component = document.createElement('div')
        this.element.component.className = Config.frames.class_prefix + 'span'
        this.applyStyleImportant(this.element.component, this.elementDivStyle)

        const options = { ...this.options, style: { base: this.options.style } }
        this.element.frame = this.manager.createElementFrame(ElementFrameTypeEnum.Span, this.field, options)

        this.element.frame.eventEmitter.on('load', () => {
            this.setupFrame()
        })
        this.element.frame.eventEmitter.on('ready', () => this.element.eventEmitter.emit('ready'))
        this.registerElementDimensionsListener()

        this.element.frame.eventEmitter.on('change', () => this.element.eventEmitter.emit('change'))
        this.element.frame.eventEmitter.on('error', (e: string) => {
            if (this.element.eventEmitter.listenerCount('error')) {
                this.element.eventEmitter.emit('error', e)
            } else {
                throw new Error(e)
            }
        })

        this.appendFrameTo(this.element.component)

        this.updateElementFrameHeight(this.options.style, true)
        this.changeClass(this.options.className, true)
    }

    protected updateClasses() {
        if (this.element.parent) {
            Utils.applyClasses(this.element.parent, [
                [this.element.className, true]
            ])
        }
    }

    protected mountTo(el: HTMLElement) {
        super.mountTo(el)
        this.uneditableCssClasses = `${this.element.parent.className} ${this.element.className}`
        this.updateClasses()
    }


    public update(options?: ISecureSpanOption) {
        return this.sendOptions(options)
    }

    public overrideOptions(options?: ISecureSpanOption) {
        this.sendOptions(options, true)
    }

    private sendOptions(
        options?: ISecureSpanOption,
        _withOverride?: boolean
    ) {
        this.checkElementDestroyed()

        if (options) {
            if (options.className !== undefined) {
                (_withOverride) && (this.element.parent.className = this.uneditableCssClasses)
                if (options.className) {
                    this.changeClass(options && options.className)
                    this.updateClasses()
                }
            }
            this.updateElementFrameHeight(options.style)
            const optionsStyle = options.style
            const optionsStyleAddBase = { ...options, style: { base: { ...optionsStyle } } }
            /**
             * updateInFrame will be of type SecureInputUserUpdateOptions and include withOverride property if needed. This is necessary in order to send the options to the
             * base server with the override instruction.
             */
            const updateInFrame: SecureSpanUserUpdateOptionValidator = Object.assign({}, Utils.filterProperties(optionsStyleAddBase, [ 'className' ], true), (_withOverride && { withOverride: _withOverride }))
            Object.keys(updateInFrame).length && this.updateElementFrame(updateInFrame)
        }

        return this
    }

    unmount(): this {
        this.checkElementDestroyed()
        const parent = this.element.component.parentElement
        if (parent) {
            parent.removeChild(this.element.component)
            this.removeClass()
        }
        this.element.parent = null
        super.unmount()
        return this
    }

    destroy(): this {
        if (!this.isDestroyed) {
            this.unmount()
            this.element.destroyed = true
            this.element.eventEmitter.emit('destroy')
            this.manager.rootFrame.sendOrQueue({
                action: FrameActionEnum.Destroy,
                payload: { frameId: this.element.frame.id }
            })
        }
        return this
    }

    private changeClass(
        className: string, init?: boolean
    ) {
        if (className) {
            init ? this.element.className += ` ${className}` : this.element.className = className
        }
    }

    private removeClass() {
        this.element.parent && Utils.applyClasses(this.element.parent, [
            [ this.element.className, false ]
        ])
    }

    protected setupFrame() {
        this.manager.rootFrame.sendOrQueue({
            action: FrameActionEnum.CreateSpan,
            payload: {
                frameId: this.element.frame.id,
                field: this.field,
                token: this.token
            }
        })
    }


}
