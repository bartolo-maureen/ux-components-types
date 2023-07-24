import { IAssociateActionData, ISecureElementStyleFontSrcs } from '@/shared/types'
import { IInitActionData } from '@/server/types'
import { IMatchActionData, ITokenizeActionData, ITokenizeFormActionData } from '@/server/components/types'
import {
    KyiParamsGetOptionValidator
} from '@/client/components/verification/flows/validators/kyiParamsGetOptionValidator'

export type IActionData =
    | IAssociateActionData
    | IInitActionData
    | ITokenizeActionData
    | ITokenizeFormActionData
    | IMatchActionData
    | ISecureElementStyleFontSrcs
    | KyiParamsGetOptionValidator
