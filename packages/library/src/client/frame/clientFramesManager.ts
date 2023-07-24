import { ActionTypeEnum, FrameActionEnum, IActionData, IFrameRequest } from '@/shared/types'
import { Config } from '@/shared/config'
import { ElementFrameTypeEnum } from '../types'
import { EventEmitter } from 'events'
import { ClientFrame } from './clientFrame'
import { Utils } from '@/shared/utils'
import { Deferred } from '@/shared/deferred'
import { UID } from '@/shared/restrict/uid'
import { FrameCommunication } from '@/shared/comms'
import { RootReportEvent } from '../components/base/secureElement/rootReport/types'
import { InternalError } from '@/server/errors'
import { IFrameMessage } from '@/server/frame/types'

export class ClientFramesManager extends FrameCommunication {

    private static instance: ClientFramesManager
    public rootFrame: ClientFrame
    private requests: IFrameRequest = {}
    private frames: { [key: string]: ClientFrame } = {}

    private constructor() {
        super()
        this.createRootFrame()
    }

    public static getInstance(): ClientFramesManager {
        if (!ClientFramesManager.instance) {
            ClientFramesManager.instance = new ClientFramesManager()
        }

        return ClientFramesManager.instance
    }


    public action(
        type: ActionTypeEnum,
        data?: IActionData
    ): Promise<any> {
        const nonce = UID.getInstance().next(type)

        this.requests[nonce] = new Deferred<(value?: any) => void>()

        const message: IFrameMessage = {
            action: FrameActionEnum.RootAction,
            payload: {
                type: type,
                nonce: nonce,
                data: data || {}
            }
        }

        this.rootFrame.sendOrQueue(message)

        return this.requests[nonce].promise
    }

    public reportToRootFrame(event: RootReportEvent) {
        this.rootFrame.sendOrQueue(
            {
                action: FrameActionEnum.RootReport,
                payload: {
                    event: event.event,
                    data: event.data || {}
                }
            }
        )
    }


    public createRootFrame() {

        const _rootFrameStyle = {
            border: 'none',
            margin: '0',
            padding: '0',
            width: '1px',
            'min-width': '100%',
            overflow: 'hidden',
            display: 'block',
            visibility: 'hidden',
            position: 'fixed',
            height: '1px',
            'pointer-events': 'none'
        }
        this.rootFrame = this.createFrame(Config.frames.id_prefix + 'root', ElementFrameTypeEnum.Root, 'root')
        this.rootFrame.iframe.setAttribute('aria-hidden', 'true')
        this.rootFrame.iframe.setAttribute('tabIndex', '-1')
        this.rootFrame.applyStyleImportant(_rootFrameStyle)

        if (document.readyState === 'complete') {
            this.ensureRootFrameMounted()
        } else {
            document.addEventListener('DOMContentLoaded', this.ensureRootFrameMounted.bind(this))
            window.addEventListener('load', this.ensureRootFrameMounted.bind(this))
        }

        window.addEventListener('message', message => {
            console.log(message)
            const parsed = this.parseMessage(message.data)
            if (parsed && Utils.compareOrigins(Config.base.secure_origin, message.origin)) {
                this.handle(parsed)
            }
        })
    }

    public createElementFrame(
        type: ElementFrameTypeEnum,
        field: string,
        options?: any
    ): ClientFrame {
        let baseStyle = {
            border: 'none',
            margin: '0',
            padding: '0',
            width: '1px',
            'min-width': '100%',
            overflow: 'hidden',
            display: 'block',
        }
        const id = UID.getInstance().next(Config.frames.id_prefix)
        const bodyStyle = document.body && window.getComputedStyle(document.body)
        const rtl = !!bodyStyle && (bodyStyle.getPropertyValue('direction') === 'rtl')
        this.createFrame(id, type, field, Object.assign({ rtl: rtl }, options))

        this.frames[id].iframe.setAttribute('title', 'Secure ' + type + ' frame')
        this.frames[id].applyStyleImportant(baseStyle)

        return this.frames[id]
    }

    protected handle(message: IFrameMessage) {
        switch (message.action) {
            case FrameActionEnum.ElementEvent:
                const frame = this.frames[message.id]
                console.warn(FrameActionEnum.ElementEvent, message.id, frame, message.payload.event, message.payload.data)
                frame && frame.eventEmitter.emit(message.payload.event, message.payload.data)
                break
            case FrameActionEnum.ElementError:
                throw new Error(message.payload.error)
            case FrameActionEnum.RootLoad:
                this.rootFrame.eventEmitter.emit('load')
                // send to elements created so far, if any. New elements will have the loaded attribute set to true from now onwards,
                // avoiding the need for this message
                Object.keys(this.frames).forEach(key => {
                    this.frames[key].sendOrQueue({
                        action: FrameActionEnum.RootLoad,
                        payload: {}
                    })
                })
                break
            case FrameActionEnum.RootActionComplete:
                const crequest = this.requests[message.payload.nonce]
                if (crequest) {
                    delete this.requests[message.payload.nonce]
                    crequest.resolve && crequest.resolve(message.payload.result)
                }
                break
            case FrameActionEnum.RootActionError:
                const erequest = this.requests[message.payload.nonce]
                if (erequest) {
                    delete this.requests[message.payload.nonce]
                    erequest.reject && erequest.reject(new Error(message.payload.error))
                }
                break
        }
    }

    protected createFrame(
        id: string,
        type: ElementFrameTypeEnum,
        field: string,
        options?: any
    ): ClientFrame {

        const origin = Utils.determineOrigin(window.location.toString())
        const queryString = Utils.urlEncodeQueryString(Object.assign({}, options, {
            type: type,
            field: field,
            origin: origin
        }))

        const iframe = document.createElement('iframe')
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('allowTransparency', 'true')
        iframe.setAttribute('scrolling', 'no')
        iframe.setAttribute('name', id)
        iframe.setAttribute('id', 'secure-frame')
        iframe.src = `${Config.base.secure_location}#${queryString}`

        const eventEmitter = new EventEmitter()
        eventEmitter.setMaxListeners(0)
        this.frames[id] = new ClientFrame(
            id,
            false,
            [],
            iframe,
            eventEmitter
        )

        eventEmitter.on('load', () => {
            this.frames[id].loaded = true
            this.frames[id].ensureMounted()
            if (this.frames[id].loaded) {
                this.frames[id].sendQueuedMessages()
            }
        })

        return this.frames[id]
    }

    protected ensureRootFrameMounted() {
        this.rootFrame.ensureMounted()
        if (!this.rootFrame.isMounted) {
            if (document.body) {
                this.rootFrame.appendTo(document.body)
            } else if ('complete' === document.readyState || 'interactive' === document.readyState) {
                // No <body> element found.
                throw new InternalError()
            }
        }
    }
}
