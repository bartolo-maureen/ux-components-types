/// < reference path="events.d.ts" />
/// < reference path="ValidationError.d.ts" />
/// < reference path="http2.d.ts" />

declare module 'ux-components-types' {
    export class Weavr {
        init(uiKey: string, options?: SecureClientOptions): WeavrComponents;
        setUserToken(authToken?: string, resolve?: () => void, reject?: (err?: any) => {}): Promise<any>;
        get capture(): CaptureComponents;
        get display(): DisplayComponents;
        get isInitialised(): boolean;
        form(): SecureForm;
    }

    export class WeavrComponents {
        setUserToken(authToken?: string, resolve?: () => void, reject?: (err?: any) => {}): Promise<any>;
        get capture(): CaptureComponents;
        get display(): DisplayComponents;
        form(): SecureForm;
        updateOptions (options: ISecureClientOption): void;
    }

    export interface ISecureSpanOption {
        className?: string;
        autocorrect?: string;
        style?: ISecureSpanElementStyleWithPseudoClass;
    }

    export class CardNumberSpanComponent extends SecureSpanComponent {
        get field(): SupportedFieldsEnum
    }

    export class CardPinSpanComponent extends SecureInputComponent {
        get field(): SupportedFieldsEnum
    }

    export class DisplayComponents {
        cardNumber(token: string, options?: ISecureSpanOption): CardNumberSpanComponent;
        cvv(token: string, options?: ISecureSpanOption): CardNumberSpanComponent;
        cardPin(token: string, options?: ISecureSpanOption): CardPinSpanComponent;
    }

    export class CaptureComponents {
        constructor(uiKey: string, options: ISecureClientOption);
        setAuthToken(token: string): void;
        password(name: string, options?: IPasswordInputOption, formId?: string): PasswordInputComponent;
        cardPin(name: string, options?: ISecureInputOption, formId?: string): CardPinInputComponent;
        passCode(name: string, options?: ISecureInputOption, formId?: string): PassCodeInputComponent;
        consumerKyc(referenceId: string): KYC;
        beneficiariesKyc(referenceId: string): KYCBeneficiaries;
        corporateKyb(referenceId: string): KYB;
    }

    export class SecureForm {
        password(name: string, options?: ISecureInputOption): PasswordInputComponent;
        cardPin(name: string, options?: ISecureInputOption): CardPinInputComponent;
        passCode(name: string, options?: ISecureInputOption): PassCodeInputComponent;
        match(inputNames?: string[]): Promise<boolean>;
        createToken(resolve?: (tokens: { [key: string]: string }) => void, reject?: (e?: any) => void): Promise<any>
        destroy(): this
    }

    export class KYC extends BaseVerificationFlow<SumSubOptionValidator> {
        launch(selector: string, options: SumSubOptionValidator, kyiParams: IKyiResponse,): SumSub
    }

    export interface ISecureElementStyle {
        color?: string
        fontFamily?: string
        fontSize?: string
        fontSmoothing?: string
        fontStyle?: string
        fontVariant?: string
        fontWeight?: string
        height?: string
        letterSpacing?: string
        lineHeight?: string
        margin?: string
        padding?: string
        textAlign?: string
        textDecoration?: string
        textIndent?: string
        textShadow?: string
        textTransform?: string
        backgroundColor?: string
        classNames?: string
        border?: string
        borderRadius?: string
    }

    export interface ISecureElementStyleFontSrc {
        cssSrc: string
    }

    export interface ISecureElementStyleFont {
        family: string
        src: string
        style?: string
        unicodeRange?: string
        weight?: string
        variant?: string
        stretch?: string
        display?: string
    }

    export interface ISecureElementStateStyle {
        base?: ISecureElementStyleWithPseudoClass
        empty?: ISecureElementStyleWithPseudoClass
        valid?: ISecureElementStyleWithPseudoClass
        invalid?: ISecureElementStyleWithPseudoClass
    }

    export interface IStrengthCheckStyleOptions {
        hideText?: boolean
        border?: string
        borderRadius?: string
        backgroundColor?: string
        weakColor?: string
        mediumColor?: string
        strongColor?: string
        classNames?: string
    }

    export interface IPasswordInputOption extends ISecureInputOption {
        strengthCheck?: boolean | IStrengthCheckStyleOptions
    }

    export interface ISecureInputOption {
        classNames?: ISecureInputOptionsStyleClass
        placeholder?: string
        maxlength?: number
        autocorrect?: string
        disabled?: boolean
        style?: ISecureElementStateStyle
        validationMode?: SecureInputValidationModeEnum
        segmented?: boolean
    }

    export interface ISecureInputContract {
        name: string
        options: ISecureInputOption
        update(options?: ISecureInputOption): this
        overrideOptions(options?: ISecureInputOption): this
        focus(): this
        blur(): this
        mount(el: HTMLElement | string): this
        clear(): this
        unmount(): this
        destroy(): this
        addListener(
            event: string,
            listener: (...args: any[]) => void
        ): this
        on(
            event: string,
            listener: (...args: any[]) => void
        ): this
        removeListener(
            event: string,
            listener: (...args: any[]) => void
        ): this
        off(
            event: string,
            listener: (...args: any[]) => void
        ): this
        removeAllListeners(event?: string): this
        createToken(): Promise<(value?: any) => void>
    }

    export interface ISecureElementStyleWithPseudoClass {
        ':hover'?: Omit<ISecureElementStyleWithPseudoClass, ':hover'>
        ':active'?: Omit<ISecureElementStyleWithPseudoClass, ':active'>
        ':disabled'?: Omit<ISecureElementStyleWithPseudoClass, ':disabled'>
        ':focus'?: Omit<ISecureElementStyleWithPseudoClass, ':focus'>
        '::placeholder'?: Omit<ISecureElementStyleWithPseudoClass, '::placeholder'>
        '::selection'?: Omit<ISecureElementStyleWithPseudoClass, '::selection'>
        ':-webkit-autofill'?: Omit<ISecureElementStyleWithPseudoClass, ':-webkit-autofill'>
    }

    export type ISecureSpanElementStyleWithPseudoClass = Omit<ISecureElementStyleWithPseudoClass, ':active' | ':disabled' | ':focus' | '::placeholder' | '::selection' | ':-webkit-autofill'>

    export interface secureElement {
        mount(el: HTMLElement | string): this
        addListener(event: string, listener: (...args: any[]) => void): this
        removeListener(event: string, listener: (...args: any[]) => void): this
        removeAllListeners(event?: string): this
        on(event: string, listener: (...args: any[]) => void): this
        off(event: string, listener: (...args: any[]) => void): this
    }

    export interface ISecureInputOptionsStyleClass {
        base?: string
        empty?: string
        focus?: string
        valid?: string
        invalid?: string
        autofill?: string
        disabled?: string
        active?: string
    }

    export interface ISecureElementStyleWithPseudoClass extends ISecureElementStyle {
        ':hover'?: Omit<ISecureElementStyleWithPseudoClass, ':hover'>
        ':active'?: Omit<ISecureElementStyleWithPseudoClass, ':active'>
        ':disabled'?: Omit<ISecureElementStyleWithPseudoClass, ':disabled'>
        ':focus'?: Omit<ISecureElementStyleWithPseudoClass, ':focus'>
        '::placeholder'?: Omit<ISecureElementStyleWithPseudoClass, '::placeholder'>
        '::selection'?: Omit<ISecureElementStyleWithPseudoClass, '::selection'>
        ':-webkit-autofill'?: Omit<ISecureElementStyleWithPseudoClass, ':-webkit-autofill'>
    }

    export interface ISecureClientOption {
        fonts: (ISecureElementStyleFontSrc | ISecureElementStyleFont)[]
    }

    export class PasswordInputComponent extends SecureInputComponent<IPasswordInputOption> {
        get field(): SupportedFieldsEnum
        get validOptions(): string[]
        createInput(): ISecureInput
    }

    export enum SecureInputValidationModeEnum {
        Touch = 'onTouch',
        Blur = 'onBlur'
    }

    export class CardPinInputComponent extends SecureInputComponent {
        get field(): SupportedFieldsEnum
    }

    export class PassCodeInputComponent extends SecureInputComponent {
        get field(): SupportedFieldsEnum
    }

    export enum SupportedFieldsEnum {
        Password = 'password',
        PasswordNumeric = 'passwordNumeric',
        CardNumber = 'cardNumber',
        CVV = 'cvv',
        CardPin = 'cardPin',
        PassCode = 'passCode'
    }

    export interface ISecureInput extends ISecureElement {
        classes: ISecureInputOptionsStyleClass,
        focused: boolean,
        empty: boolean,
        invalid: boolean,
        valid: boolean,
        disabled: boolean,
        autofilled: boolean,
        focusListener?: () => void
        fakeInput?: HTMLInputElement,
        label?: HTMLLabelElement,
        lastBackgroundColor?: string,
        formId?: string
    }

    export interface ISecureElement {
        field: string
        eventEmitter: EventEmitter
        destroyed: boolean
        frame?: ClientFrame
        component?: HTMLElement
        parent?: HTMLElement
        lastFontSize?: string
        lastHeight?: string
    }

    export class KYB extends BaseVerificationFlow<SumSubOptionValidator> {
        launch(
            selector: string,
            options: SumSubOptionValidator,
            kyiParams: IKyiResponse,
        ): SumSub
    }

    export class KYCBeneficiaries extends BaseVerificationFlow<SumSubOptionValidator> {}

    export abstract class BaseVerificationFlow<T = VerificationFlowOptionValidator> {
        uiKey: string
        referenceId: string
        authToken?: string

        mount(
            selector: string,
            options: T
        ): Promise<BaseVerificationFlowProvider>
    }

    export class SumSub extends BaseVerificationFlowProvider {
        mount(
            selector: string,
            options: T
        ): Promise<BaseVerificationFlowProvider>
    }

    export abstract class BaseVerificationFlowProvider {
        mount(selector: string): Promise<this>
        onMessage(
            type: any,
            payload?: any
        ): void
    }

    export class ClientFrame {
        eventEmitter?: EventEmitter;
        id: string;
        iframe: HTMLIFrameElement;
        loaded: boolean;
        queuedMessages: IFramesMessage;

        sendQueuedMessages(): void
        sendOrQueue(message: IFrameMessage): void
        queueMessage(message: IFrameMessage): void
        postMessage(message: IFrameMessage): void
        ensureMounted(): void
        unmount(): void
        get isMounted()
        applyStyleImportant(style: any): void
        appendTo(el: HTMLElement): void
    }

    export abstract class SecureInputComponent<T extends ISecureInputOption = ISecureInputOption> extends SecureElement implements ISecureInputContract {
        defaultCssClassNames: {
            base: 'opc-uxsec-input',
            focus: 'opc-uxsec-input--focus',
            valid: 'opc-uxsec-input--valid',
            invalid: 'opc-uxsec-input--invalid',
            empty: 'opc-uxsec-input--empty',
            autofill: 'opc-uxsec-input--autofill',
            disabled: 'opc-uxsec-input--disabled'
        }

        elementDivStyle: {
            margin: '0',
            padding: '0',
            border: 'none',
            display: 'block',
            background: 'transparent',
            position: 'relative',
            opacity: '1'
        }

        elementInputStyle: {
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

        options: T
        public readonly name: string
        internalOptions: ISecureInputInternalOption
        element: ISecureInput
        get validOptions(): string[]
        createInput(): ISecureInput
        focus(): this
        update(options?: ISecureInputOption)
        overrideOptions(options?: ISecureInputOption)
        blur(): this
        clear(): this
        unmount(): this
        destroy(): this
        createToken(): Promise<any>
    }

    export abstract class SecureElement {
        get manager()
        mount(el: HTMLElement | string): this
        addListener(event: string, listener: (...args: any[]) => void): this
        removeListener(event: string, listener: (...args: any[]) => void): this
        removeAllListeners(event?: string): this
        on(event: string, listener: (...args: any[]) => void): this
        off(event: string, listener: (...args: any[]) => void): this
    }

    export abstract class SecureSpanComponent extends SecureElement implements ISecureSpanContract {
        name: string
        options: ISecureSpanOptionsWithSecureClientOption
        element: ISecureSpan
        get field(): SupportedFieldsEnum
        token: string
        defaultCssClassName: string
        uneditableCssClasses: string
        elementDivStyle: {
            margin: '0',
            padding: '0',
            border: 'none',
            display: 'block',
            background: 'transparent',
            position: 'relative',
            opacity: '1'
        }
        createSpan(): void
        update(options?: ISecureSpanOption)
        overrideOptions(options?: ISecureSpanOption): void
        unmount(): this
        destroy(): this
    }

    export class SumSubOptionValidator extends VerificationFlowOptionValidator {
        lang?: string
        onMessage: (type: any, payload?: any) => void
        onError: (error: any) => void
    }

    export class VerificationFlowOptionValidator extends BaseOption {
        customCss?: string
        customCssStr?: string
        email?: string
        mobile?: string
    }

    export abstract class BaseOption {
        fill(object: any): this
        validate(): Promise<void>
        validateSync(): ValidationError[]
        isValid(): boolean
        get(filter: string[]): Partial<any>
    }

    export class IKyiResponse {
        params: {
            accessToken: string
            externalUserId: string
            identityType: string
            kycProviderKey: string
        }
    }

    export interface IFrameMessage {
        id?: string
        action: FrameActionEnum
        payload: IFramePayload
    }

    export type IFramesMessage = IFrameMessage[]

    export interface IFramePayload {
        frameId?: string
        formId?: string
        field?: string
        token?: string
        event?: string
        data?: any
        type?: ActionTypeEnum
        nonce?: string
        result?: any
        error?: string
        rtl?: boolean,
        fonts?: ISecureElementStyleFont[]
    }

    export enum ActionTypeEnum {
        Init = 'INIT',
        FetchFont = 'FETCH_FONT',
        Tokenize = 'TOKENIZE',
        Associate = 'ASSOCIATE',
        Match = 'MATCH',
        KyiParamsGet = 'KYI_PARAMS_GET',
        BeneficiariesParamsGet = 'BENEFICIARIES_PARAMS_GET'
    }

    export enum FrameActionEnum {
        Ready = 'opc-uxsec-ready',
        Destroy = 'opc-uxsec-destroy',
        Focus = 'opc-uxsec-focus',
        Update = 'opc-uxsec-update',
        Clear = 'opc-uxsec-clear',
        Mount = 'opc-uxsec-mount',
        Report = 'opc-uxsec-report',
        ElementEvent = 'opc-uxsec-element-event',
        ElementError = 'opc-uxsec-element-error',
        ElementLoad = 'opc-uxsec-element-load',
        ElementRequest = 'opc-uxsec-element-request',
        ElementRequestComplete = 'opc-uxsec-element-request-complete',
        ElementRequestError = 'opc-uxsec-element-request-error',
        CreateInput = 'opc-uxsec-create-input',
        CreateSpan = 'opc-uxsec-create-span',
        RootInit = 'opc-uxsec-root-init',
        RootLoad = 'opc-uxsec-root-load',
        RootUpdate = 'opc-uxsec-root-update',
        RootReport = 'opc-uxsec-root-report',
        RootAction = 'opc-uxsec-root-action',
        RootActionComplete = 'opc-uxsec-root-action-complete',
        RootActionError = 'opc-uxsec-root-action-error',
    }

    export interface ISecureInputInternalOption {
        formId?: string
    }

    export interface ISecureSpan extends ISecureElement {
        id: string
        className: string
    }

    export interface ISecureSpanOption {
        className?: string
        autocorrect?: string
        style?: ISecureSpanElementStyleWithPseudoClass
    }

    export interface ISecureSpanOptionsWithSecureClientOption extends ISecureSpanOption, ISecureClientOption{}

    export interface ISecureSpanContract {
        name: string
        options: ISecureSpanOptionsWithSecureClientOption
        update(options?: ISecureSpanOption): this
        unmount(): this
        destroy(): this
        addListener(event: string, listener: (...args: any[]) => void): this
        on(event: string, listener: (...args: any[]) => void): this
        removeListener(event: string, listener: (...args: any[]) => void): this
        removeAllListeners(event?: string): this
    }
}
