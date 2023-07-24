import { ISecureClientOption } from '../../types'
import { CardNumberSpanComponent } from './cardNumberSpanComponent'
import { CVVSpanComponent } from './cvvSpanComponent'
import { CardPinSpanComponent } from './cardPinSpanComponent'
import { ISecureSpanOption } from './types'

export class DisplayComponents {
    protected options: ISecureClientOption | null = null

    constructor(options: ISecureClientOption) {
        this.options = options
    }

    cardNumber(
        token: string,
        options?: ISecureSpanOption
    ): CardNumberSpanComponent {
        return new CardNumberSpanComponent(this.options, token, options)
    }

    cvv(
        token: string,
        options?: ISecureSpanOption
    ): CardNumberSpanComponent {
        return new CVVSpanComponent(this.options, token, options)
    }

    cardPin(
        token: string,
        options?: ISecureSpanOption
    ): CardPinSpanComponent {
        return new CardPinSpanComponent(this.options, token, options)
    }
}
