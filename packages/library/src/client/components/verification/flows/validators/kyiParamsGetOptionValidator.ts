import { BaseOption } from '@/server/utils/baseOption'
import { IsOptional, IsString } from 'class-validator'

export class KyiParamsGetOptionValidator extends BaseOption {
    @IsString()
    referenceId: string

    @IsOptional()
    @IsString()
    authToken?: string
}
