import { BaseOption } from '@/server/utils/baseOption'
import { IsOptional, IsString } from 'class-validator'

export class VerificationFlowOptionValidator extends BaseOption {
    @IsOptional()
    @IsString()
    customCss?: string

    @IsOptional()
    @IsString()
    customCssStr?: string

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    mobile?: string
}
