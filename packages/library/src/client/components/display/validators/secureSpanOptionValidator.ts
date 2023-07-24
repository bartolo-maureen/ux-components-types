import { BaseOption } from '@/server/utils/baseOption'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import {
    SecureElementStyleWithPseudoClassesOptionValidator
} from '../../shared/style/validators/secureElementStyleWithPseudoClassesOptionValidator'
import { ISecureSpanElementStyleWithPseudoClass } from '../../shared/style/types'

export class SecureSpanOptionValidator extends BaseOption {
    @IsOptional()
    @IsString()
    className?: string

    @IsOptional()
    @IsString()
    autocorrect?: string

    @IsOptional()
    @ValidateNested()
    _style?: ISecureSpanElementStyleWithPseudoClass

    public set style(style: ISecureSpanElementStyleWithPseudoClass) {
        this._style = this.convertAndFill(new SecureElementStyleWithPseudoClassesOptionValidator, style)
    }

    public get style() {
        return this._style
    }
}
