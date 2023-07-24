import { EventEmitter } from 'events'
import { FrameActionEnum } from '@/shared/types'
import { ClientFramesManager } from '@/client/frame/clientFramesManager'
import { Utils } from '@/shared/utils'
import { Config } from '@/shared/config'
import { ISecureInputState, ISecureSpanState, ServerEventEnum, SupportedFieldsEnum } from '../types'
import { SecureBaseOptionValidator } from './secureBaseOptionValidator'
import { IFrameMessage, IFramesMessage } from '@/server/frame/types'
import { RequestHandler } from '../types/aliases'
import { FIELD_UTILS } from '@/server/utils/fieldUtils'
import { RootUpdateOptionValidator } from '../../rootUpdateOptionValidator'

export abstract class SecureBaseServer {

    private loaded: boolean
    protected eventEmitter: EventEmitter
    protected queuedMessages: IFramesMessage = []
    protected options: SecureBaseOptionValidator
    protected headFontStyleSheet: HTMLStyleElement
    state: ISecureInputState | ISecureSpanState

    protected constructor(options: SecureBaseOptionValidator) {
        this.eventEmitter = new EventEmitter()
        this.eventEmitter.setMaxListeners(0)

        this.setupPostMessage()

        this.options = options

        this.loaded = !!options.loaded
    }

    protected abstract get value(): any;

    get type(): string {
        return this.options.type
    }

    get id(): string {
        return window.name
    }

    protected get fieldType(): SupportedFieldsEnum {
        return this.options.field
    }

    protected abstract requestHandler: RequestHandler

    protected get frameManager() {
        return ClientFramesManager.getInstance()
    }

    report(
        event: string,
        data?: any
    ) {
        this.sendOrQueueRootMessage({
            action: FrameActionEnum.Report,
            payload: {
                event: event,
                data: Object.assign({}, data, {
                    type: this.type
                })
            }
        })
    }

    load() {
        this.sendOrQueueRootMessage({
            id: this.id,
            action: FrameActionEnum.ElementLoad,
            payload: {}
        })
        this.event('load')
    }

    error(error: string) {
        this.frameManager.sendParentFrameMessage({
            id: this.id,
            action: FrameActionEnum.ElementError,
            payload: {
                error: error
            }
        })
    }

    protected event(
        event: string,
        data?: any
    ) {
        this.frameManager.sendParentFrameMessage({
            id: this.id,
            action: FrameActionEnum.ElementEvent,
            payload: {
                event: event,
                data: data || {}
            }
        })
    }

    private setupPostMessage() {
        window.addEventListener('message', (message) => {
            const parsed: IFrameMessage = this.frameManager.parseMessage(message.data)
            if (parsed) {
                console.warn(parsed)
                const isHandleSecure = this.isHandleSecure(message)

                if (isHandleSecure) {
                    this.handleSecure(parsed)
                } else {
                    this.handleParent(parsed)
                }
            } else {
                console.error('Unparsable', message.data)
            }
        })
    }

    public isHandleSecure(message: MessageEvent) {
        return Utils.compareOrigins(Config.base.secure_origin, (message.origin !== 'null') ? message.origin : null)
    }

    get rootFrame() {
        return Utils.getWindowByName(window.parent, Config.frames.id_prefix + 'root')
    }

    private sendOrQueueRootMessage(message: IFrameMessage) {
        if (this.loaded) {
            const origin = Config.base.secure_origin
            this.rootFrame.postMessage(JSON.stringify(Object.assign({}, message, {
                id: this.id,
                [Config.frames.unique_comms_channel]: true
            })), origin)
        } else {
            this.queuedMessages.push(message)
        }
    }

    private emit(
        event: ServerEventEnum,
        payload?: any
    ) {
        this.eventEmitter.emit(event, payload)
    }

    private handleSecure(message: IFrameMessage) {
        console.warn('_handleSecure', message.action)
        switch (message.action) {
            case FrameActionEnum.RootInit:
                this.emit(ServerEventEnum.RootInit)
                break
            case FrameActionEnum.RootUpdate:
                this.emit(ServerEventEnum.RootUpdate, message.payload)
                break
            case FrameActionEnum.ElementRequest:
                this.requestHandler(message.payload, result => {
                    this.sendOrQueueRootMessage({
                        action: FrameActionEnum.ElementRequestComplete,
                        payload: {
                            nonce: message.payload.nonce,
                            result: result
                        }
                    })
                }, error => {
                    this.sendOrQueueRootMessage({
                        action: FrameActionEnum.ElementRequestError,
                        payload: {
                            nonce: message.payload.nonce,
                            error: error.message
                        }
                    })
                })
                break
        }
    }

    private handleParent(message: IFrameMessage) {
        console.warn('_handleParent', message.action)
        switch (message.action) {
            case FrameActionEnum.RootLoad:
                this.loaded = true
                this.queuedMessages.forEach(message => this.sendOrQueueRootMessage(message))
                this.queuedMessages = []
                break
            case FrameActionEnum.RootUpdate:
                this.emit(ServerEventEnum.RootUpdate, message.payload)
                break
            case FrameActionEnum.Update:
                this.emit(ServerEventEnum.UserUpdate, message.payload)
                break
            case FrameActionEnum.Mount:
                this.emit(ServerEventEnum.UserMount, message.payload)
                break
            case FrameActionEnum.Focus:
                window.focus()
                this.emit(ServerEventEnum.UserFocus)
                break
            case FrameActionEnum.Clear:
                this.emit(ServerEventEnum.UserClear)
                break
        }
    }

    REQUEST_FRAME_HANDLER() {
        return window.requestAnimationFrame
            || (window as any)['mozRequestAnimationFrame']
            || (window as any)['oRequestAnimationFrame']
            || function(callback: FrameRequestCallback) {
                return window.setTimeout(callback, 1000 / 60)
            }
    }

    setState(
        partialState: ISecureInputState | ISecureSpanState,
        callback?: () => void
    ) {
        this.state = Object.assign(this.state, partialState)
        this.render()

        callback && callback()
    }

    protected createIframeHeadFontStyleSheet() {
        const headStyleSheet = document.createElement('style')
        headStyleSheet.setAttribute('type', 'text/css')
        headStyleSheet.innerHTML = FIELD_UTILS.renderFontsCss(this.state.fonts)
        document.head.appendChild(headStyleSheet)

        this.headFontStyleSheet = headStyleSheet
    }

    protected updateIframeHeadFontStyleSheet(
        _currentRunTimeState: ISecureInputState | ISecureSpanState,
        _options: RootUpdateOptionValidator
    ) {
        this.headFontStyleSheet.innerHTML = FIELD_UTILS.renderFontsCss(_options.fonts)

        return Object.assign(_currentRunTimeState, _options)
    }

    protected setSecureElementInnerStyleSheet() {

        const secureElementInnerStyleSheet = document.createElement('style')
        secureElementInnerStyleSheet.setAttribute('type', 'text/css')
        secureElementInnerStyleSheet.innerHTML = FIELD_UTILS.renderStyleCss(this.state.style)

        return secureElementInnerStyleSheet
    }

    public abstract render(): void
}
