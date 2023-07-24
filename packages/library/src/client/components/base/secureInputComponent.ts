import {SecureElement} from './secureElement/secureElement'
import {ISecureInput, ISecureInputContract} from './types'
import {ISecureInputInternalOption, ISecureInputOption} from '../capture/types'
import {ElementFrameTypeEnum, ISecureClientOption} from '../../types'
import {Utils} from '@/shared/utils'
import {EventEmitter} from 'events'
import {Config} from '@/shared/config'
import {ISecureInputOptionsStyleClass} from '../shared/style/types'
import {ActionTypeEnum, FrameActionEnum} from '@/shared/types'
import {SecureFormManager} from '../form/secureFormManager'
import {
    SecureInputUserUpdateOptionValidator
} from '@/server/components/elements/input/secureInputUserUpdateOptionValidator'
import {InternalError} from '@/server/errors'
import {SupportedFieldsEnum} from '@/server/components/elements/types'

export abstract class SecureInputComponent<T extends ISecureInputOption = ISecureInputOption> extends SecureElement implements ISecureInputContract {

    /**
     * These default CSS classes are used to wrap our element with a class, so that the client can then use this class to
     * apply styling on the element.
     */
    defaultCssClassNames = {
        base: 'opc-uxsec-input',
        focus: 'opc-uxsec-input--focus',
        valid: 'opc-uxsec-input--valid',
        invalid: 'opc-uxsec-input--invalid',
        empty: 'opc-uxsec-input--empty',
        autofill: 'opc-uxsec-input--autofill',
        disabled: 'opc-uxsec-input--disabled'
    }

    elementDivStyle = {
        margin: '0',
        padding: '0',
        border: 'none',
        display: 'block',
        background: 'transparent',
        position: 'relative',
        opacity: '1'
    }

    elementInputStyle = {
        border: 'none',
        display: 'block',
        position: 'absolute',
        height: '1px',
        top: '0',
        left: '0',
        padding: '0',
        margin: '0',
        width: '100%',
        opacity: '0',
        background: 'transparent',
        pointerEvents: 'none'
    }

    element: ISecureInput

    options: T // Todo: This is not correct

    internalOptions: ISecureInputInternalOption

    public readonly name: string

    abstract get field(): SupportedFieldsEnum

    get validOptions(): string[] {
        return [ 'classNames', 'placeholder', 'style', 'maxlength', 'disabled', 'validationMode', 'segmented' ] // autocorrect??
    }

    constructor(
        secureClientOptions: ISecureClientOption,
        name: string,
        options?: T,
        internalOptions?: ISecureInputInternalOption
    ) {
        super()
        this.name = name


        // @todo[mb] validate
        options = Utils.filterProperties(options, this.validOptions)

        this.options = Object.assign(
            {},
            options,
            secureClientOptions,
            {
                name: name,
                loaded: this.manager.rootFrame.loaded
            }
        )


        this.internalOptions = internalOptions || {}

        this.createInput()
    }

    protected updateClasses() {
        if (this.element.parent) {
            Utils.applyClasses(this.element.parent, [
                [ this.element.classes.base, true ],
                [ this.element.classes.empty, this.element.empty ],
                [ this.element.classes.focus, this.element.focused ],
                [ this.element.classes.valid, this.element.valid ],
                [ this.element.classes.invalid, this.element.invalid ],
                [ this.element.classes.autofill, this.element.autofilled ],
                [ this.element.classes.disabled, this.element.disabled ]
            ])
        }
    }

    protected changeClasses(classNames: ISecureInputOptionsStyleClass) {
        if (classNames) {
            const parsed = {} as any
            Object.keys(classNames).forEach(cl => {
                if (!(this.defaultCssClassNames as any)[cl]) {
                    // cl + ' is not in ' + Object.keys(this.defaultCssClassNames).join(', ')
                    throw new InternalError()
                }
                parsed[cl] = (classNames as any)[cl]
            })
            this.element.classes = Object.assign({}, this.element.classes, parsed)
        }
    }

    private removeClasses() {
        if (this.element.parent) {
            Utils.applyClasses(this.element.parent, [
                [ this.element.classes.base, false ],
                [ this.element.classes.empty, false ],
                [ this.element.classes.focus, false ],
                [ this.element.classes.valid, false ],
                [ this.element.classes.invalid, false ],
                [ this.element.classes.autofill, false ],
                [ this.element.classes.disabled, false ]
            ])
        }
    }

    createInput() {
        if (this.field !== SupportedFieldsEnum.PassCode) delete this.options['segmented']
        this.element = {
            field: this.field,
            eventEmitter: new EventEmitter(),
            classes: Object.assign({}, this.defaultCssClassNames),
            destroyed: false,
            focused: false,
            empty: true,
            invalid: false,
            valid: false,
            disabled: !!this.options.disabled,
            autofilled: false,
            formId: this.internalOptions.formId || undefined
        }

        this.element.eventEmitter.setMaxListeners(0)
        this.element.focusListener = this.focus.bind(this)

        this.element.component = document.createElement('div')
        this.element.component.className = Config.frames.class_prefix + 'input'
        this.element.fakeInput = document.createElement('input')

        this.element.fakeInput.type = 'text'
        this.element.fakeInput.className = Config.frames.class_prefix + 'input__fake'
        this.applyStyleImportant(this.element.component, this.elementDivStyle)
        this.applyStyleImportant(this.element.fakeInput, this.elementInputStyle)
        this.element.fakeInput.setAttribute('aria-hidden', 'true')
        this.element.fakeInput.disabled = true
        this.element.fakeInput.addEventListener('focus', this.focusElementFrame.bind(this))

        this.element.frame = this.manager.createElementFrame(ElementFrameTypeEnum.Input, this.field, this.options)

        this.element.frame.eventEmitter.on('load', () => {
            this.setupFrame()
            this.element.fakeInput.disabled = false
        })
        this.element.frame.eventEmitter.on('ready', () => this.element.eventEmitter.emit('ready'))
        this.registerElementDimensionsListener()

        this.element.frame.eventEmitter.on('change', event => {

            this.element.eventEmitter.emit('change', {
                empty: event.empty,
                valid: event.valid
            })
            this.element.empty = event.empty
            this.element.invalid = !!event.error
            this.element.valid = event.valid

            this.updateClasses()
        })

        this.element.frame.eventEmitter.on('strength', event => {
            this.element.eventEmitter.emit('strength', event)
        })
        this.element.frame.eventEmitter.on('redirectfocus', event => {
            const focusTarget = this.findFocusTarget(event.focusDirection)
            focusTarget && focusTarget.focus()
        })
        this.element.frame.eventEmitter.on('focus', () => {
            this.element.focused = true
            this.updateClasses()
            this.element.eventEmitter.emit('focus')
        })
        this.element.frame.eventEmitter.on('blur', () => {
            this.element.focused = false
            this.updateClasses()
            this.element.eventEmitter.emit('blur')
        })
        this.element.frame.eventEmitter.on('keyup', event => {
            this.element.eventEmitter.emit('keyup', {
                key: event.key,
                preventDefault: () => {
                }
            })

            if (event.key === 'Enter') {
                this.element.eventEmitter.emit('submit')
            }
        })
        this.element.frame.eventEmitter.on('autofill', () => {
            if (this.element.parent) {
                const parentBgColor = this.element.parent.style.backgroundColor
                const isDefaultAutofillColor = (parentBgColor === '#faffbd') || (parentBgColor === 'rgb(250, 255, 189)')
                this.element.lastBackgroundColor = isDefaultAutofillColor ? this.element.lastBackgroundColor : parentBgColor
                this.element.parent.style.backgroundColor = '#faffbd'
                this.element.autofilled = true
                this.updateClasses()
            }
        })
        this.element.frame.eventEmitter.on('autofill-cleared', () => {
            this.element.autofilled = false
            this.element.parent && (this.element.parent.style.backgroundColor = this.element.lastBackgroundColor || '')
            this.updateClasses()
        })

        this.appendFrameTo(this.element.component)
        this.element.component.appendChild(this.element.fakeInput)

        this.updateFrameHeight(this.options, true)
        this.changeClasses(this.options.classNames)

        return this.element
    }

    protected updateFrameHeight(
        options?: ISecureInputOption,
        force?: boolean
    ) {
        this.updateElementFrameHeight(options && options.style && options.style.base, force)
    }

    // If function is triggered on submit, an event will be emitted to a parent form to submit that form
    protected formSubmit(input: ISecureInput) {
        let form = input.component.parentElement
        while (form && form.nodeName !== 'FORM') {
            form = form.parentElement
        }
        if (form) {
            const event = document.createEvent('Event')
            event.initEvent('submit', true, true)
            form.dispatchEvent(event)
        }
    }


    public focus() {
        this.checkElementDestroyed()
        event && event.preventDefault()
        this.focusElementFrame()
        return this
    }

    public update(options?: ISecureInputOption) {
        return this.sendOptions(options)
    }


    public overrideOptions(options?: ISecureInputOption) {
        return this.sendOptions(options, true)
    }

    private sendOptions(
        options?: ISecureInputOption,
        _withOverride?: boolean
    ) {
        this.checkElementDestroyed()
        if (options) {
            this.updateWrapperElement(options)
            this.updateFrameHeight(options)

            /**
             * updateInFrame will be of type SecureInputUserUpdateOptions and include withOverride property if needed. This is necessary in order to send the options to the
             * base server with the override instruction.
             */
            const updateInFrame: SecureInputUserUpdateOptionValidator = Object.assign({}, Utils.filterProperties(options, [ 'classNames' ], true), (_withOverride && { withOverride: _withOverride }))
            Object.keys(updateInFrame).length && this.updateElementFrame(updateInFrame)
        }

        return this
    }

    private updateWrapperElement(options?: ISecureInputOption) {
        // Set wrapping element with client update defined attributes/states
        this.element.disabled = !!options.disabled

        // Update css classes on wrapping element
        !!(options && options.classNames) ? this.changeClasses(options.classNames) : this.updateClasses()
    }

    public blur() {
        this.checkElementDestroyed()
        super.blur()
        this.element.fakeInput.blur()

        return this
    }

    public clear() {
        this.checkElementDestroyed()
        super.clear()
        return this
    }

    public unmount() {
        this.checkElementDestroyed()
        const parent = this.element.component.parentElement
        if (parent) {
            parent.removeChild(this.element.component)
            parent.removeEventListener('click', this.element.focusListener)
            this.removeClasses()
        }
        this.element.parent = null
        if (this.element.label) {
            this.element.label.removeEventListener('click', this.element.focusListener)
            this.element.label = null
        }
        this.element.fakeInput.disabled = true
        super.unmount()

        return this
    }

    public destroy() {
        if (!this.isDestroyed) {
            this.unmount()
            this.element.destroyed = true
            this.element.eventEmitter.emit('destroy')
            if (this.element.formId) {
                SecureFormManager.deleteInput(this.element.formId, this)
            }
            this.manager.rootFrame.sendOrQueue({
                action: FrameActionEnum.Destroy,
                payload: { frameId: this.element.frame.id }
            })
        }

        return this
    }

    protected mountTo(el: HTMLElement) {
        super.mountTo(el)
        this.findPossibleLabel()
        this.updateClasses()
    }

    protected findPossibleLabel() {
        if (this.element.parent) {
            const parentId = this.element.parent.getAttribute('id')
            let label
            if (parentId) {
                label = document.querySelector('label[for=' + parentId + ']')
            }
            if (label) {
                this.element.parent.addEventListener('click', this.element.focusListener)
            } else {
                label = this.element.parent.parentElement
                while (label && (label.nodeName !== 'LABEL')) {
                    label = label.parentElement
                }
                if (label) {
                    this.element.label = label as HTMLLabelElement
                    label.addEventListener('click', this.element.focusListener)
                } else {
                    this.element.parent.addEventListener('click', this.element.focusListener)
                }
            }
        }
    }

    protected setupFrame() {
        this.manager.rootFrame.sendOrQueue({
            action: FrameActionEnum.CreateInput,
            payload: {
                frameId: this.element.frame.id,
                formId: this.element.formId
            }
        })
    }

    createToken() {
        return this.manager.action(ActionTypeEnum.Tokenize, { frameId: this.element.frame.id })
    }
}
