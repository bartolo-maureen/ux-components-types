import { BaseOption } from '@/server/utils/baseOption'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'
import {
    SecureElementStylesOptionValidator
} from '@/client/components/shared/style/validators/secureElementStylesOptionValidator'

export class UserUpdateOptionValidator extends BaseOption {
    @IsOptional()
    @IsBoolean()
    withOverride: boolean

    @IsOptional()
    @ValidateNested()
    _style?: SecureElementStylesOptionValidator

    public set style(style: SecureElementStylesOptionValidator) {
        this._style = this.convertAndFill(new SecureElementStylesOptionValidator, style)
    }

    public get style() {
        return this._style
    }

}
