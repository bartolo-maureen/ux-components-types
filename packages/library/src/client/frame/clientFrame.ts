import { Config } from '@/shared/config'
import { EventEmitter } from 'events'
import { IFrameMessage, IFramesMessage } from '@/server/frame/types'

export class ClientFrame {
    eventEmitter?: EventEmitter;
    id: string;
    iframe: HTMLIFrameElement;
    loaded: boolean;
    queuedMessages: IFramesMessage;


    constructor(
        id: string,
        loaded: boolean,
        queuedMessages: IFramesMessage,
        iframe: HTMLIFrameElement,
        eventEmitter?: EventEmitter
    ) {
        this.id = id;
        this.loaded = loaded;
        this.queuedMessages = queuedMessages;
        this.iframe = iframe;
        this.eventEmitter = eventEmitter;
    }

    public sendQueuedMessages() {
        this.queuedMessages.forEach(message => this.sendOrQueue(message))
        this.queuedMessages = []
    }

    public sendOrQueue(message: IFrameMessage) {
        this.ensureMounted()

        if (this.loaded) {
            this.postMessage(message)
        } else {
            this.queueMessage(message)
        }
    }


    public queueMessage(message: IFrameMessage) {
        this.queuedMessages.push(message)
    }

    public postMessage(message: IFrameMessage) {
        const _origin = Config.base.secure_origin

        const _message = {
            ...message,
            id: this.id,
            [Config.frames.unique_comms_channel]: true
        }

        this.iframe.contentWindow.postMessage(_message, _origin)
    }


    public ensureMounted() {
        this.isMounted || this.unmount()
    }

    public unmount() {
        this.loaded = false
    }

    public get isMounted() {
        return !!document.body && document.body.contains(this.iframe)
    }


    public applyStyleImportant(style: any) {
        this.iframe.style.cssText = Object.keys(style).map(key => key + ': ' + style[key] + ' !important;').join(' ')
    }


    public appendTo(el: HTMLElement) {
        el.appendChild(this.iframe)
    }

}
