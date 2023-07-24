import { BaseOption } from '@/server/utils/baseOption'
import { SecureElementStyleContract } from '../types'
import { IsOptional, IsString } from 'class-validator'
import { CssProperty } from '@/shared/extend/decorators'

export class SecureElementStyleOptionValidator extends BaseOption implements SecureElementStyleContract {
    @IsOptional()
    @IsString()
    @CssProperty()
    color?: string

    @IsOptional()
    @IsString()
    fontFamily?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    fontSize?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    fontSmoothing?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    fontStyle?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    fontVariant?: string

    @IsOptional()
    @CssProperty()
    fontWeight?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    height?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    letterSpacing?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    lineHeight?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    margin?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    padding?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    textAlign?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    textDecoration?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    textIndent?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    textShadow?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    textTransform?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    backgroundColor?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    border?: string

    @IsOptional()
    @IsString()
    @CssProperty()
    borderRadius?: string
}
