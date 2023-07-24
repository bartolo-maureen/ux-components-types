import { SecureSpanComponent } from '../base/secureSpanComponent'
import { SupportedFieldsEnum } from '@/server/components/elements/types'

export class CardNumberSpanComponent extends SecureSpanComponent {
    get field(): SupportedFieldsEnum {
        return SupportedFieldsEnum.CardNumber;
    }
}
