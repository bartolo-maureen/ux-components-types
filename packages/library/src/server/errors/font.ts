import { SecureElementStyleFontOptionValidator } from '../validators/secureElementStyleFontOptionValidator'
import { ServerErrorCodeEnum } from './types'

export class InvalidFontsError extends Error {
    public fonts: SecureElementStyleFontOptionValidator[]

    constructor(fonts?: SecureElementStyleFontOptionValidator[]) {
        super(ServerErrorCodeEnum.INVALID_FONTS)
        this.fonts = fonts
    }
}
