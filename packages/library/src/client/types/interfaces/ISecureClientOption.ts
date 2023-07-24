import { ISecureElementStyleFont, ISecureElementStyleFontSrc } from '@/shared/types'

export interface ISecureClientOption {
  fonts: (ISecureElementStyleFontSrc | ISecureElementStyleFont)[]
}
