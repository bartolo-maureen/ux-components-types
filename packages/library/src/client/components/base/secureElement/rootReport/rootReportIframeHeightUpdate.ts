import { RootReportEventEnum } from './types'
import { RootReportBase } from './rootReportBase'

export class RootReportIframeHeightUpdate extends RootReportBase {
    event = RootReportEventEnum.IframeHeightUpdate
    data: {
        height: number,
        calculated_height: number
    }

    constructor(
        height: number,
        calculatedHeight: number
    ) {
        super()
        this.data = { height: height, calculated_height: calculatedHeight }
    }
}
