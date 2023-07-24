import { SecureBaseServer } from '../base/secureBaseServer'
import { SecureInputOptionValidator } from './secureInputOptionValidator'
import { ISecureInputState, IValueMeta, ServerEventEnum, SUPPORTED_FIELDS, SupportedFieldsEnum } from '../types'
import { Utils } from '@/shared/utils'
import { passwordStrength } from '@/shared/components/utils'
import { RequestHandler } from '../types/aliases'
import { RootUpdateOptionValidator } from '../../rootUpdateOptionValidator'
import { SecureInputUserUpdateOptionValidator } from './secureInputUserUpdateOptionValidator'
import { FIELD_UTILS } from '@/server/utils/fieldUtils'
import { SecureInputValidationModeEnum } from '@/client/components/capture/types'
import { ISecureInputServer } from '@/server/components/elements/types/interfaces/ISecureInputServer'
import { IAutocorrectResult } from '@/server/utils/types'

export class SecureInput extends SecureBaseServer {
    declare state: ISecureInputState
    DEFAULT_META: IValueMeta = {
        error: false,
        valid: false,
        empty: true,
        safeValue: {
            type: 'none',
            value: null
        }
    }
    DEFAULT_STATE: ISecureInputState = {
        dirty: false,
        rtl: false,
        fonts: [],
        placeholder: '',
        meta: [ ...this.defaultMeta ]
    }
    protected declare options: SecureInputOptionValidator
    protected controllerListeners: {
        [key: string]: (...args: any[]) => void
    }
    private autofilled: boolean
    private deletingKey?: 'Backspace' | 'Delete'
    private width: number
    private height: number
    private elements: ISecureInputServer
    private lastMessage: any
    private windowListeners: {
        [key: string]: (...args: any[]) => void
    }
    private lastStrengthId: number | null = null
    private metaBlur: IValueMeta[] = []

    constructor(options: SecureInputOptionValidator) {

        super(options)
        this.updateDimensions = this.updateDimensions.bind(this)
        this.handleAutofill = this.handleAutofill.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleFocusNext = this.handleFocusNext.bind(this)
        this.handleFocusPrevious = this.handleFocusPrevious.bind(this)
        this.sendChangeEvent = this.sendChangeEvent.bind(this)

        this.state = Object.assign({
            formatted: this.formattedDefaultArray,
            value: '',
            selection: {
                start: 0,
                end: 0
            }
        }, this.setStateFromOptions(options))


        this.autofilled = false
        this.width = 0
        this.height = 0
        this.lastMessage = {
            error: false,
            valid: false,
            empty: true,
            value: null
        }


        this.controllerListeners = {}
        this.controllerListeners[ServerEventEnum.RootUpdate] = event => {
            if (Object.keys(event).length) {
                const options = new RootUpdateOptionValidator(event)

                options.validate().then(() => {
                    this.setState(this.setStateFromOptions(options))
                })
            }
        }
        this.controllerListeners[ServerEventEnum.RootInit] = () => {
            this.setState({
                wait: false
            }, () => this.event('ready'))
        }
        this.controllerListeners[ServerEventEnum.UserUpdate] = event => {
            if (Object.keys(event).length) {
                const options = new SecureInputUserUpdateOptionValidator(event)
                options.validate().then(() => {
                    this.setState(this.setStateFromOptions(options))
                })
            }
        }
        this.controllerListeners[ServerEventEnum.UserMount] = event => {
            event.rtl !== this.state.rtl && this.setState({
                rtl: event.rtl
            })
        }
        this.controllerListeners[ServerEventEnum.UserClear] = () => {
            this.setState({
                value: undefined,
                meta: [ ...this.DEFAULT_STATE.meta ]
            }, this.sendChangeEvent)
        }

        this.emitInteractionEvents()
        this.load()

        Object.keys(this.controllerListeners)
            .forEach(key => this.eventEmitter.addListener(key, this.controllerListeners[key]))
        Object.keys(this.windowListeners).forEach(key => window.addEventListener(key, this.windowListeners[key]))


        this.render()
    }

    get field() {
        return SUPPORTED_FIELDS[this.fieldType]
    }

    protected get value(): string {
        return this.state.value
    }

    protected get name(): string {
        return this.options.name
    }

    private get formattedDefaultArray() {
        return Array(this.numberOfSegments).fill('') as string[]
    }

    private get defaultMeta() {
        return Array(this.numberOfSegments).fill(this.DEFAULT_META)
    }


    private get numberOfSegments() {
        return this.isSegmented ? +this.options.maxlength || 4 : 1
    }

    private get isSegmented() {
        return !!this.options.segmented
    }

    private get segmentsFormattedValue() {
        return this.elements.input.map((el) => {
            return el.value
        })
    }

    private get joinedSegmentsFormattedValue() {
        return this.segmentsFormattedValue.join('')
    }

    private get autocorrectPattern() {
        // if segmented we only allow 1 character per input
        if (this.isSegmented)
            return '0 ?'

        if (this.fieldType === SupportedFieldsEnum.PassCode) {
            const maxLength = +this.options.maxlength || 4
            const prepandFormat = Array(maxLength - 1).fill(' ').join('').concat('?')
            return Array(maxLength).fill('0').join('').concat(prepandFormat)
        }

        // no autocorrect
        return undefined
    }

    private get inputElementsAsArray() {
        return Array(this.numberOfSegments)
            .fill({})
            .map((
                el,
                index
            ) => {
                return {
                    ...el,
                    name: `input-segment-${index}`
                }
            })
    }

    render() {
        let append = false

        let inputElements: HTMLInputElement[] = this.inputElementsAsArray

        if (!this.elements) {
            append = true

            const div = document.createElement('div')
            div.className = 'secure-element'

            this.createIframeHeadFontStyleSheet()
            const secureElementInnerStyleSheet = this.setSecureElementInnerStyleSheet()

            const prevInput = document.createElement('input')
            prevInput.className = 'secure-element__fake'
            prevInput.style.opacity = '0'
            prevInput.onfocus = this.handleFocusPrevious
            prevInput.setAttribute('autocomplete', 'off')
            prevInput.setAttribute('aria-hidden', 'true')

            const label = document.createElement('label')
            label.className = 'secure-element__label'

            this.isSegmented && this.setSegmentStyle(label)

            inputElements.forEach((
                el,
                index
            ) => {
                inputElements[index] = document.createElement('input')
                inputElements[index].setAttribute('name', el.name)
                inputElements[index].setAttribute('autocomplete', 'off')
                inputElements[index].setAttribute('autocorrect', 'off')
                inputElements[index].setAttribute('autocapitalize', 'off')
                inputElements[index].setAttribute('spellcheck', 'false')
                inputElements[index].setAttribute('aria-label', this.field.label)
                inputElements[index].setAttribute('aria-invalid', this.state.meta[index].error ? 'true' : 'false')
                inputElements[index].setAttribute('id', 'secure-element')
                inputElements[index].onkeydown = (ev: KeyboardEvent) => {
                    this.handleKeyDown(ev, index)
                }
                inputElements[index].onkeyup = this.handleKeyUp
                inputElements[index].oninput = (ev: InputEvent) => {
                    this.handleInput(ev, index)
                    if (index < (this.numberOfSegments - 1) && this.state.meta[index].valid) {
                        this.elements.input[index + 1].select()
                    }

                }
                inputElements[index].addEventListener('animationstart', this.handleAutofill)
            })

            const nextInput = document.createElement('input')
            nextInput.className = 'secure-element__fake'
            nextInput.style.opacity = '0'
            nextInput.onfocus = this.handleFocusNext
            nextInput.setAttribute('auto-complete', 'off')
            nextInput.setAttribute('aria-hidden', 'true')


            inputElements.forEach((
                el,
                index
            ) => label.appendChild(inputElements[index]))


            div.appendChild(secureElementInnerStyleSheet)
            div.appendChild(prevInput)
            div.appendChild(label)
            div.appendChild(nextInput)

            this.elements = {
                div: div,
                style: secureElementInnerStyleSheet,
                prevInput: prevInput,
                label: label,
                nextInput: nextInput,
                input: inputElements
            }

        } else {
            this.reRenderSecureElementStyle()
        }

        if (this.state.wait) {
            this.elements.div.setAttribute('style', 'visibility: hidden')
        } else {
            this.elements.div.removeAttribute('style')
        }
        this.elements.div.dir = this.state.rtl ? 'rtl' : 'ltr'

        this.elements.prevInput.disabled = !this.state.focused

        this.addClasses()

        inputElements.forEach((
            el,
            index
        ) => {

            this.elements.input[index].placeholder = this.state.placeholder

            if (this.state.maxlength) {
                this.elements.input[index].maxLength = this.state.maxlength
            }

            this.elements.input[index].setAttribute('aria-placeholder', this.state.placeholder)

            this.elements.input[index].value = this.state.formatted[index]

            !this.isSegmented && this.elements.input[index].setSelectionRange(this.state.selection.start, this.state.selection.end)

            if (this.state.disabled) {
                this.elements.input[index].setAttribute('disabled', '')
            } else {
                this.elements.input[index].removeAttribute('disabled')
            }
        })

        this.elements.nextInput.disabled = !this.state.focused

        append && document.body.appendChild(this.elements.div)

        this.updateDimensions()
    }

    protected requestHandler: RequestHandler = (
        payload,
        resolve,
        reject
    ) => {
        resolve({
            name: this.name,
            field: this.fieldType,
            value: this.value
        })
    }

    // Use for Segmented Passcode to indicate that segments are have missing values
    private allSegmentsState(_meta: IValueMeta[]): IValueMeta {
        const { allValid, allEmpty } = {
            allValid: _meta.every((el) => el.valid),
            allEmpty: _meta.every((el) => el.empty),
        }

        return {
            valid: allValid,
            empty: allEmpty,
            error: !allValid && !allEmpty
        }

    }

    private emitInteractionEvents() {
        this.windowListeners = {}

        this.windowListeners['focus'] = event => {
            if (this.state.disabled) return
            this.event('focus')
            this.setState({
                focused: true
            })

            this.elements.input[0].focus()

        }
        this.windowListeners['blur'] = event => {
            if (this.state.disabled) return

            this.metaBlur = Array.from(this.state.meta)

            this.addClasses()
            this.setState({
                focused: false
            })


            this.event('blur')
        }
    }

    private addClasses() {
        const isValidationModeTouch = this.options.validationMode === SecureInputValidationModeEnum.Touch
        const isValidationModeBlur = (this.options.validationMode === SecureInputValidationModeEnum.Blur) || (this.options.validationMode === undefined)
        const withMetaBlur = !!this.metaBlur.length
        const classes = [ 'secure-element__element', ...this.state.disabled ? [ 'is-disabled' ] : [], ]

        if (this.state.dirty) {
            if (isValidationModeTouch) {
                classes.push(...this.withClassesPerMeta(this.state.meta))
            } else if (isValidationModeBlur && withMetaBlur) {
                // this.metaBlur.lenght will show that the metaBlur has been set and therefore we will
                // style according to metaBlur.
                classes.push(...this.withClassesPerMeta(this.metaBlur))
            }
        }

        let resolvedType = this.field.type || (this.state.focused ? this.field.focusedType : this.field.blurredType) || 'text'

        this.state.focused && classes.push('is-focused')

        if (resolvedType === 'passwordNumeric') {
            resolvedType = 'tel'
            classes.push('security-disc')
        }

        if (this.isSegmented) {
            classes.push('secure-element__segmented')
        }

        this.elements.input.forEach((
            el,
            index
        ) => {
            this.elements.input[index].className = classes.join(' ')
            this.elements.input[index].type = resolvedType
        })

    }

    private withClassesPerMeta(_meta: IValueMeta[]) {
        const _classes = [ '' ]

        if (this.isSegmented) {
            const { valid, empty, error } = this.allSegmentsState(_meta)
            valid && _classes.push('is-valid')
            empty && _classes.push('is-empty')
            error && _classes.push('is-invalid')
        } else {
            _meta.every((elMeta) => {
                return elMeta.valid && !elMeta.error
            }) && _classes.push('is-valid')

            _meta.every((elMeta) => {
                return elMeta.empty
            }) && _classes.push('is-empty')

            _meta.some((elMeta) => {
                return !!elMeta.error
            }) && _classes.push('is-invalid')
        }

        return _classes
    }

    private setSegmentStyle(el: HTMLElement) {

        el.className += ' secure-element__label-segmented'

        // Taking basline gap as 5%. Minimum Gap is also 5%.
        const gaps = this.numberOfSegments - 1
        const segmentGap = this.numberOfSegments > 4 ? +(15 / (this.numberOfSegments - 1)).toFixed(2) : 5
        const segmentWidth = (100 - (+segmentGap * gaps)) / this.numberOfSegments

        const style: Partial<CSSStyleDeclaration> = {
            ...(this.numberOfSegments > 4 && { gap: `${segmentGap}%` }),
            gridTemplateColumns: `repeat(${this.numberOfSegments}, ${segmentWidth}%)`
        }

        Object.assign(el.style, style)

    }

    private reRenderSecureElementStyle() {
        if (this.options.style) {
            this.elements.style.innerHTML = `${FIELD_UTILS.renderStyleCss(this.state.style)}`
        }
    }

    /**
     * This is where we set/update the secure element ui etc.
     * @return Object of configurations that will be used to reflect the update.
     * @param options
     * @private
     */
    private setStateFromOptions(options: SecureInputOptionValidator | RootUpdateOptionValidator | SecureInputUserUpdateOptionValidator): ISecureInputState {
        const rest: ISecureInputState = options.get([ 'wait', 'rtl', 'placeholder', 'style', 'maxlength', 'disabled' ])

        const state = this.state || Object.assign({}, this.DEFAULT_STATE)


        if (options instanceof RootUpdateOptionValidator) {
            return this.updateIframeHeadFontStyleSheet(state, options)
        }

        if (!(options instanceof SecureInputUserUpdateOptionValidator)) {
            const fonts = options.fonts ? [].concat(state.fonts, options.fonts) : state.fonts
            return Object.assign(state, rest, {
                fonts: fonts
            })
        }


        if (options.withOverride) {
            return this.getNewOptions(rest)
        }


        /**
         * since options is an instanceof SecureInputUserUpdateOptions then we update the object with the new data
         * This is used to trigger dynamic user updates
         */

        return Utils.mergeObjectsDeep(state, rest)

    }

    private getNewOptions(_options: ISecureInputState) {
        return Object.assign({}, _options)
    }

    private updateDimensions() {

        const size = this.elements
            ? this.elements.input[0].getBoundingClientRect()
            : { width: 0, height: 0 }

        if ((this.width !== size.width) || (this.height !== size.height)) {
            this.event('dimensions', {
                width: size.width,
                height: size.height
            })
            this.width = size.width
            this.height = size.height
        }

        this.REQUEST_FRAME_HANDLER()(this.updateDimensions.bind(this))

    }

    private handleAutofill(event: AnimationEvent) {
        if (event.animationName === 'void-autofill') {
            this.autofilled = true
            this.event('autofill')
        } else if (event.animationName === 'void-noautofill' && this.autofilled) {
            this.autofilled = false
            this.event('autofill-cleared')
        }
    }

    private handleKeyDown(
        event: KeyboardEvent,
        index: number
    ) {
        if ((event.key === 'Backspace') || (event.key === 'Delete')) {
            this.deletingKey = event.key

            if (index > 0 && this.state.meta[index].empty) {
                event.preventDefault()
                this.elements.input[index - 1].select()
            }
        }
    }

    private handleKeyUp(event: KeyboardEvent) {
        if ((event.key === 'Enter') || (event.key === 'Escape')) {
            this.event('keyup', {
                key: event.key
            })
        } else {
            delete this.deletingKey
        }
    }

    private getAutocorrected(
        autocorrect: string,
        value: string,
        index: number
    ) {
        return FIELD_UTILS.autocorrect(autocorrect, value, {
            start: this.elements.input[index].selectionStart,
            end: this.elements.input[index].selectionEnd
        }, this.deletingKey)
    }

    private updateSegmentStateMeta(
        index: number,
        _meta: IValueMeta[],
        _asAutocorrected: boolean,
        _value?: IAutocorrectResult | string
    ) {

        let newMeta: IValueMeta & { valid: boolean; error: boolean; empty: boolean }
        if (_asAutocorrected) {
            const valueAutocorrect = _value as IAutocorrectResult
            const metaOut = {
                valid: valueAutocorrect.valid,
                empty: !valueAutocorrect.value,
                error: !valueAutocorrect.valid && !!valueAutocorrect.value
            }


            newMeta = Object.assign({}, _meta[index], metaOut)
        } else {
            newMeta = Object.assign({}, _meta[index], {
                valid: !!_value,
                empty: !_value,
                error: null
            })
        }

        _meta[index] = newMeta

        return _meta
    }

    private handleInput(
        event,
        index: number
    ) {
        const updateValue = () => {
            this.elements.input[index].value = event.data
            return event.data
        }

        const valueAtIndex = this.isSegmented ? updateValue() : this.elements.input[index].value
        const autocorrect = this.autocorrectPattern


        let stateReq: ISecureInputState = {
            formatted: this.segmentsFormattedValue,
            value: this.joinedSegmentsFormattedValue,
            dirty: true
        }

        if (autocorrect) {

            const autocorrected = this.getAutocorrected(autocorrect, valueAtIndex, index)

            stateReq = {
                ...stateReq,
                selection: autocorrected.selection,
                meta: this.updateSegmentStateMeta(index, this.state.meta, true, autocorrected),
            }

            stateReq.formatted[index] = autocorrected.formatted
            this.elements.input[index].setAttribute('aria-invalid', this.state.meta[index].error ? 'true' : 'false')

        } else {
            stateReq = {
                ...stateReq,
                selection: {
                    start: this.elements.input[index].selectionStart,
                    end: this.elements.input[index].selectionEnd
                },
                meta: this.updateSegmentStateMeta(index, this.state.meta, false, valueAtIndex)
            }
        }

        this.setState(stateReq, this.sendChangeEvent.bind(this))

        if (this.fieldType === SupportedFieldsEnum.Password) {
            const strength = passwordStrength(this.value)
            if (strength.id !== this.lastStrengthId) {
                this.event('strength', {
                    id: strength.id,
                    value: strength.value
                })

                this.lastStrengthId = strength.id
            }
        }

    }

    private handleFocusNext(event: FocusEvent) {
        return this.redirectFocus(event, 'next')
    }

    private handleFocusPrevious(event: FocusEvent) {
        return this.redirectFocus(event, 'previous')
    }

    private redirectFocus(
        event: FocusEvent,
        focusDirection: 'previous' | 'next'
    ) {
        (event.target as any).blur && (event.target as any).blur()
        this.event('redirectfocus', {
            focusDirection: focusDirection
        })
    }

    private sendChangeEvent() {
        const rest = Utils.filterProperties(this.state.meta[0], [ 'error', 'valid', 'safeValue' ], true)

        const message = {
            error: this.state.meta.every((meta) => !!meta.error),
            valid: (this.state.meta.every((meta) => !!meta.valid) && !this.state.meta.every((meta) => !!meta.error)),
            empty: this.state.meta.every((meta) => !!meta.empty)
        }

        if (!Utils.equals(message, this.lastMessage || {})) {
            this.event('change', message)
        }

        this.lastMessage = message
    }
}
