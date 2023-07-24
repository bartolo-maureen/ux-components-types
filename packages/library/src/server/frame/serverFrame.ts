import { Config } from '@/shared/config'
import { EventEmitter } from 'events'
import { IFrameMessage, IFramesMessage } from './types'

export class ServerFrame {
    eventEmitter?: EventEmitter
    id: string
    iframe: Window
    private loaded: boolean
    queuedMessages: IFramesMessage
    formId: string

    constructor(
        id: string,
        loaded: boolean,
        queuedMessages: IFramesMessage,
        iframe: Window,
        formId?: string,
        eventEmitter?: EventEmitter
    ) {
        this.id = id
        this.loaded = loaded
        this.queuedMessages = queuedMessages
        this.iframe = iframe
        this.eventEmitter = eventEmitter
        this.formId = formId
    }

    public setLoaded() {
        this.loaded = true
    }

    public sendOrQueue(
        message: IFrameMessage
    ) {
        console.log('sendOrQueue', this.loaded, message)
        if (this.loaded) {
            const origin = Config.base.secure_origin

            const _message = JSON.stringify(
                Object.assign({}, message, {
                id: this.id,
                [Config.frames.unique_comms_channel]: true
            }))

            this.iframe.postMessage(_message, origin)
        } else {
            this.queuedMessages.push(message)
        }
    }
}
