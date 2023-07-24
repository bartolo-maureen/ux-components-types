import { BaseOption } from '../utils/baseOption'
import { IsOptional, ValidateNested } from 'class-validator'
import { SecureElementStyleFontOptionValidator } from '../validators/secureElementStyleFontOptionValidator'
import { InvalidFontsError } from '../errors'

export class RootUpdateOptionValidator extends BaseOption {
    @IsOptional()
    @ValidateNested()
    _fonts?: SecureElementStyleFontOptionValidator[]

    public set fonts(fonts: SecureElementStyleFontOptionValidator[]) {
        const out: SecureElementStyleFontOptionValidator[] = [];
        if (!Array.isArray(fonts)) {
            throw new InvalidFontsError(fonts);
        }

        fonts.forEach(font => {
            if (font.family) {
                out.push(this.convertAndFill(new SecureElementStyleFontOptionValidator, font))
            }
        });

        this._fonts = out
    }

    public get fonts() {
        return this._fonts
    }
}
