import { BaseOption } from '@/server/utils/baseOption'
import { IsBoolean, IsBooleanString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { SecureElementStyleFontOptionValidator } from '@/server/validators/secureElementStyleFontOptionValidator'
import { Autocorrect } from '@/shared/extend/decorators'
import {
    SecureElementStylesOptionValidator
} from '@/client/components/shared/style/validators/secureElementStylesOptionValidator'
import { InvalidFontsError } from '@/server/errors'
import { HashParamTypeEnum } from '@/server/types'
import { SupportedFieldsEnum } from '../types'

export class SecureBaseOptionValidator extends BaseOption {
    @IsString()
    type: HashParamTypeEnum

    @IsEnum(SupportedFieldsEnum)
    field: SupportedFieldsEnum

    @IsOptional()
    @IsBooleanString()
    loaded?: boolean

    @IsString()
    origin: string

    @IsOptional()
    @IsBoolean()
    wait?: boolean

    @IsOptional()
    @IsBoolean()
    rtl: boolean

    @IsOptional()
    @ValidateNested()
    _fonts?: SecureElementStyleFontOptionValidator[]

    @IsOptional()
    @Autocorrect()
    autocorrect?: string

    @IsOptional()
    @ValidateNested()
    _style?: SecureElementStylesOptionValidator


    public set style(style: SecureElementStylesOptionValidator) {
        this._style = this.convertAndFill(new SecureElementStylesOptionValidator, style)
    }

    public get style() {
        return this._style
    }

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
