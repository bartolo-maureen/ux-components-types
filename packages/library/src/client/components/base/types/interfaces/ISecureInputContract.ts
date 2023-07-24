import { ISecureInputOption } from '../../../capture/types'

export interface ISecureInputContract {
    name: string

    options: ISecureInputOption

    update(options?: ISecureInputOption): this

    overrideOptions(options?: ISecureInputOption): this

    focus(): this

    blur(): this

    mount(el: HTMLElement | string): this

    clear(): this

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

    off(
        event: string,
        listener: (...args: any[]) => void
    ): this

    removeAllListeners(event?: string): this

    createToken(): Promise<(value?: any) => void>
}
