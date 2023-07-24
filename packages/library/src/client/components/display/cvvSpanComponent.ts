import { SecureSpanComponent } from '../base/secureSpanComponent'
import { SupportedFieldsEnum } from '@/server/components/elements/types'

export class CVVSpanComponent extends SecureSpanComponent {
    get field(): SupportedFieldsEnum {
        return SupportedFieldsEnum.CVV;
    }
}
