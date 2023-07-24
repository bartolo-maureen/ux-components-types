import { SecureBaseOptionValidator } from '../base/secureBaseOptionValidator'
import { IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator'
import { SecureInputValidationModeEnum } from '@/client/components/capture/types'

export class SecureInputOptionValidator extends SecureBaseOptionValidator {

    @IsOptional()
    @IsString()
    formId?: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    placeholder?: string

    @IsOptional()
    @IsNumberString()
    maxlength: number

    @IsOptional()
    @IsBooleanString()
    disabled: boolean

    @IsOptional()
    @IsEnum(SecureInputValidationModeEnum)
    validationMode: SecureInputValidationModeEnum

    @IsOptional()
    @IsBooleanString()
    segmented: boolean
}
