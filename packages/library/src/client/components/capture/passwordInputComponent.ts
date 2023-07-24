import { SecureInputComponent } from '../base/secureInputComponent'
import { PasswordStrengthComponent } from './addons/passwordStrength/passwordStrengthComponent'
import { IPasswordInputOption } from './types'
import { SupportedFieldsEnum } from '@/server/components/elements/types'

export class PasswordInputComponent extends SecureInputComponent<IPasswordInputOption> {
    get field(): SupportedFieldsEnum {
        return SupportedFieldsEnum.Password;
    }

    get validOptions(): string[] {
        return [ 'classNames', 'placeholder', 'style', 'maxlength', 'disabled', 'strengthCheck', 'validationMode' ]
    }

    createInput() {
        const input = super.createInput()

        if (this.options.strengthCheck) {
            const options = typeof this.options.strengthCheck === 'boolean' ? {} : this.options.strengthCheck
            new PasswordStrengthComponent(this, options)
        }

        return input
    }
}
