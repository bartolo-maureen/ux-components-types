import { SecureInputComponent } from '../base/secureInputComponent'
import { SupportedFieldsEnum } from '@/server/components/elements/types'

export class PassCodeInputComponent extends SecureInputComponent {
    get field(): SupportedFieldsEnum {
        return SupportedFieldsEnum.PassCode;
    }
}
