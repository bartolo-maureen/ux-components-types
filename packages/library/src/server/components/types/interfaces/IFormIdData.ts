export interface IFormIdData {
    formId: string
}

export interface IMatchActionData extends IFormIdData {
    inputNames?: string[]
}


export type ITokenizeFormActionData = IFormIdData
