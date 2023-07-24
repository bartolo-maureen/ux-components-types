import { VerificationFlowOptionValidator } from '../validators/verificationFlowOptionValidator'
import { IsOptional, IsString } from 'class-validator'

export class SumSubOptionValidator extends VerificationFlowOptionValidator {
    @IsOptional()
    @IsString()
    lang?: string

    @IsOptional()
    onMessage: (
        type: any,
        payload?: any
    ) => void

    @IsOptional()
    onError: (error: any) => void
}
