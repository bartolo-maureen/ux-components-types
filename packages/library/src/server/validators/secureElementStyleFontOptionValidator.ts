import { BaseOption } from '../utils/baseOption'
import { IsAlpha, IsAlphanumeric, IsOptional, Matches } from 'class-validator'
import { FontSource } from '@/shared/extend/decorators'
import { SecureElementContract } from '@/shared/types'

export class SecureElementStyleFontOptionValidator extends BaseOption implements SecureElementContract {
    @FontSource()
    src: string

    @Matches(/^[-_a-zA-Z0-9\s'"]*$/)
    family: string

    @IsOptional()
    @Matches(/^[-U+A-Fa-f0-9?, ]*$/)
    unicodeRange?: string

    @IsOptional()
    @Matches(/^[a-zA-Z0-9-()\s]*$/)
    variant?: string

    @IsOptional()
    @IsAlpha()
    display?: string

    @IsOptional()
    @IsAlphanumeric()
    stretch?: string

    @IsOptional()
    @IsAlphanumeric()
    style?: string

    @IsOptional()
    @IsAlphanumeric()
    weight?: string
}
