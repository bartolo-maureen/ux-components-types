import { Utils } from '../utils'
import { Config } from '../config'
import { IFrameMessage } from '@/server/frame/types'

export class FrameCommunication {
    public parseMessage(message: any): IFrameMessage {
        try {
            const parsed = typeof message === 'string' ? JSON.parse(message) : message
            return parsed[Config.frames.unique_comms_channel] ? Utils.filterProperties(parsed, [ 'id', 'action', 'payload' ]) : null
        } catch (e) {
            return null
        }
    }

    public sendParentFrameMessage(message: IFrameMessage) {
        window.parent.postMessage(JSON.stringify(Object.assign({}, message, {
            [Config.frames.unique_comms_channel]: true
        })), '*');
    }


}
