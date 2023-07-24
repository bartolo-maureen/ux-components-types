import { ISecureSpanOption, ISecureSpanOptionsWithSecureClientOption } from '../../../display/types'

export interface ISecureSpanContract {
    name: string
    options: ISecureSpanOptionsWithSecureClientOption

    update(options?: ISecureSpanOption): this

    unmount(): this

    destroy(): this

    addListener(
        event: string,
        listener: (...args: any[]) => void
    ): this

    on(
        event: string,
        listener: (...args: any[]) => void
    ): this

    removeListener(
        event: string,
        listener: (...args: any[]) => void
    ): this

    removeAllListeners(event?: string): this
}
