import { Weavr } from './weavr'
import { isLocal } from '@/shared/restrict'

const protocol = window.location.protocol
const isApprovedProtocol = ['https:', 'file:'].indexOf(protocol) !== -1

if (!isApprovedProtocol) {
    if (isLocal(window.location.hostname)) {
        window.console && console.warn('Live UX security only available over HTTPS. Switch to HTTPS outside of testing')
    } else {
        throw new Error('UX security only available over HTTPS')
    }
}

declare global {
    interface Window {
        weavr: Weavr
    }
}

window.weavr = new Weavr()
