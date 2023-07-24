import { RootReportEventEnum } from './types'
import { RootReportBase } from './rootReportBase'

export class RootReportWrapperHeightMismatch extends RootReportBase {
    event = RootReportEventEnum.IframeHeightUpdate
    data: {
        height: number,
        outer_height: number
    }

    constructor(
        height: number,
        outerHeight: number
    ) {
        super()
        this.data = { height: height, outer_height: outerHeight }
    }
}
