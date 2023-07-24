import { Utils } from './utils'

export const Config = {
    base: {
        api_url: import.meta.env.VITE_BASE_URL,
        secure_location: import.meta.env.VITE_SECURE_LOCATION,
        secure_origin: Utils.determineOrigin(import.meta.env.VITE_SECURE_LOCATION)
    },
    frames: {
        id_prefix: '__opc_uxsec_',
        class_prefix: '__opc-uxsec-',
        unique_comms_channel: '__weavrV2'
    },
    providers: {
        sum_sub: {
            url: import.meta.env.VITE_SUM_SUB_URL,
        }
    }
}

