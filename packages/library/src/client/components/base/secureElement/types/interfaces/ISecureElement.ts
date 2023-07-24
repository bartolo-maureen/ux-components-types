import { EventEmitter } from 'events'
import { ClientFrame } from '@/client/frame/clientFrame'

export interface ISecureElement {
    field: string
    eventEmitter: EventEmitter
    destroyed: boolean
    frame?: ClientFrame
    component?: HTMLElement
    parent?: HTMLElement
    lastFontSize?: string
    lastHeight?: string
}
