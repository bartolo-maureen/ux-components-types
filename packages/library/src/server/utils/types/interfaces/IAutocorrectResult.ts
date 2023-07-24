export interface IAutocorrectResult {
    formatted: string,
    value: string,
    selection: {
        start: number,
        end: number
    },
    valid: boolean
}
