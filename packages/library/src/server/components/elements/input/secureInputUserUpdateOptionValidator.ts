import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { UserUpdateOptionValidator } from '../shared/userUpdateOptionValidator'

export class SecureInputUserUpdateOptionValidator extends UserUpdateOptionValidator {
    @IsOptional()
    @IsString()
    placeholder?: string

    @IsOptional()
    @IsString()
    maxlength?: string

    @IsOptional()
    @IsBoolean()
    disabled?: boolean
}
