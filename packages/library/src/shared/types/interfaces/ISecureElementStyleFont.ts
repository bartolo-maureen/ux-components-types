export interface ISecureElementStyleFont {
    family: string
    src: string
    style?: string
    unicodeRange?: string
    weight?: string
    variant?: string
    stretch?: string
    display?: string
}

export type ISecureElementStyleFonts = ISecureElementStyleFont[]
export type SecureElementContract = ISecureElementStyleFont
