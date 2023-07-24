import { RootReportEventEnum } from './types'

export abstract class RootReportBase {
    abstract event: RootReportEventEnum
    abstract data: {}
}
