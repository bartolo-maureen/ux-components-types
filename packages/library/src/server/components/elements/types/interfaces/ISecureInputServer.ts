import { ISecureComponentServer } from '@/server/components/elements/types/interfaces/ISecureComponentServer'

export interface ISecureInputServer extends ISecureComponentServer {
    prevInput: HTMLInputElement,
    label: HTMLLabelElement,
    input: HTMLInputElement[],
    segmentedInput1?: HTMLInputElement,
    segmentedInput2?: HTMLInputElement,
    segmentedInput3?: HTMLInputElement,
    segmentedInput4?: HTMLInputElement,
    nextInput: HTMLInputElement
}
