export interface IValueMeta {
    error?: boolean
    valid?: boolean
    empty?: boolean
    safeValue?: {
        type: string
        value: any
    }
    extra?: any
}
