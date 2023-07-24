import { SecureSpanComponent } from '../base/secureSpanComponent'
import { SupportedFieldsEnum } from '@/server/components/elements/types'

export class CardPinSpanComponent extends SecureSpanComponent {
    get field(): SupportedFieldsEnum {
        return SupportedFieldsEnum.CardPin;
    }
}
