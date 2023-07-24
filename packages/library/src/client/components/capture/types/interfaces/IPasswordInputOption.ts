import { ISecureInputOption } from './ISecureInputOption'

export interface IStrengthCheckStyleOptions {
    hideText?: boolean
    border?: string
    borderRadius?: string
    backgroundColor?: string
    weakColor?: string
    mediumColor?: string
    strongColor?: string
    classNames?: string
}

export interface IPasswordInputOption extends ISecureInputOption {
    strengthCheck?: boolean | IStrengthCheckStyleOptions
}
