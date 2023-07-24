export interface IFieldDefinition {
    type?: string
    permanent?: boolean
    focusedType?: string
    blurredType?: string
    label?: string
    autocorrect?: string
    maxContent: string
    noBufferForMaxContent?: boolean
    regex?: string
    regexMessage?: string
}
