import { Config } from '@/shared/config'
import { defaultOptions as strengthCheckerOptions } from '../../../../../shared/components/utils/checkPasswordStrength'
import { SecureInputComponent } from '../../../base/secureInputComponent'
import { PasswordStrengthStyling } from './passwordStrengthStyling'
import { IStrengthCheckStyleOptions } from '../../types'

export class PasswordStrengthComponent {
    strengthBar: HTMLProgressElement
    textDiv?: HTMLDivElement
    options?: IStrengthCheckStyleOptions

    constructor(parentComponent: SecureInputComponent, options?: IStrengthCheckStyleOptions) {
        this.options = options
        const id = PasswordStrengthStyling.Generate(options)
        this.generateComponent(parentComponent.element.component, id)

        this.registerForChange(parentComponent)
    }

    generateComponent(parentElement: HTMLElement, id: string) {
        const strengthContainer = document.createElement('div')
        strengthContainer.id = id
        strengthContainer.className = `${Config.frames.class_prefix}strength-check `

        this.strengthBar = document.createElement('progress')
        this.strengthBar.className = `${Config.frames.class_prefix}strength-check_bar ${this.options.classNames}`
        this.strengthBar.max = strengthCheckerOptions.length - 1
        this.strengthBar.value = 0

        strengthContainer.appendChild(this.strengthBar)

        if (!this.options?.hideText) {
            this.textDiv = document.createElement('div')
            this.textDiv.className = `${Config.frames.class_prefix}strength-check_value`
            this.textDiv.innerText = ''

            strengthContainer.appendChild(this.textDiv)
        }

        parentElement.appendChild(strengthContainer)
    }

    registerForChange(parentComponent: SecureInputComponent) {
        parentComponent.on('strength', ({ id, value }) => {
            this.strengthBar.value = id

            const kebabCase = this.toKebabCase(value)
            this.strengthBar.className = `${Config.frames.class_prefix}strength-check_bar ${Config.frames.class_prefix}strength-check_${kebabCase} ${this.options.classNames}`

            if (this.textDiv) {
                this.textDiv.innerText = value
                this.textDiv.className = `${Config.frames.class_prefix}strength-check_value ${Config.frames.class_prefix}strength-check_${kebabCase}`
            }
        })
    }

    private toKebabCase(str: string) {
        return str.replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    }
}
