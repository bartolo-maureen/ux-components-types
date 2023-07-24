import { SecureForm } from './secureFormComponent'
import { SecureInputComponent } from '../base/secureInputComponent'
import { FormNotEmptyError, FormNotFoundError } from '../../errors'

export class SecureFormManager {
    private static instance: SecureFormManager

    forms: {
        [key: string]: {
            [key: string]: SecureInputComponent
        }
    } = {}

    private constructor() {
    }

    private static getInstance() {
        if (!SecureFormManager.instance)
            SecureFormManager.instance = new SecureFormManager()

        return SecureFormManager.instance
    }

    public static create(form: SecureForm) {
        this.getInstance().forms[form.id] = {}
    }

    public static delete(form: SecureForm) {
        const formId = form.id
        if (!this.getInstance().forms[formId])
            throw new FormNotFoundError()
        if (Object.keys(this.getInstance().forms[formId]).length)
            throw new FormNotEmptyError('Destroy inputs before destroying form')

        delete this.getInstance().forms[formId]
    }

    public static hasInput(formId: string, input: string) {
        return !!this.getInstance().forms[formId] && !!this.getInstance().forms[formId][input]
    }

    public static addInput(formId: string, input: SecureInputComponent) {
        if (!this.getInstance().forms[formId])
            throw new FormNotFoundError()

        this.getInstance().forms[formId][input.name] = input
    }

    public static deleteInput(formId: string, input: SecureInputComponent) {
        if (!this.getInstance().forms[formId])
            throw new FormNotFoundError()

        delete this.getInstance().forms[formId][input.name]
    }
}
