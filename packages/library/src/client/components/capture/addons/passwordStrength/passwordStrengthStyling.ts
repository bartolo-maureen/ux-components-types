import { Config } from '@/shared/config'
import { IStrengthCheckStyleOptions } from '../../types'

const DEFAULT_STYLE_OPTIONS: IStrengthCheckStyleOptions = {
    border: '1px solid black',
    borderRadius: '1rem',
    backgroundColor: 'white',
    weakColor: '#fe4657',
    mediumColor: '#ffa500',
    strongColor: '#24ac5c',
    classNames: '',
}

export class PasswordStrengthStyling {
    private static _instance: PasswordStrengthStyling

    lastId = 1
    styleElement: HTMLStyleElement | null = null

    private constructor() {
    }

    private static get instance() {
        return this._instance || (this._instance = new this())
    }

    public static Generate(options?: IStrengthCheckStyleOptions) {
        if (!this.instance.styleElement) {
            this.instance.generateStyleElement()
        }

        const id = this.instance.getNextId()
        this.instance.setScopedStyle(id, options)
        return id
    }

    generateStyleElement() {
        this.styleElement = document.createElement('style')
        const defaultStyling = this.generateGlobalStyleTest()
        const styleTextNode = document.createTextNode(defaultStyling)

        this.styleElement.append(styleTextNode)
        this.appendToHead()
    }

    setScopedStyle(id: string, options?: IStrengthCheckStyleOptions) {
        if (!this.styleElement || !options) return

        const css = this.generateStyleText(options, id)
        const styleTextNode = document.createTextNode(css)

        this.styleElement.append(styleTextNode)
    }

    generateGlobalStyleTest() {
        const css = this.generateStyleText(DEFAULT_STYLE_OPTIONS)
        return `progress.${Config.frames.class_prefix}strength-check_bar { overflow: hidden; } ${css}`
    }

    generateStyleText(options: IStrengthCheckStyleOptions, id?: string) {
        const idText = id ? `#${id}` : ''

        let css = ``

        if (options.border) css += `${idText} progress.${Config.frames.class_prefix}strength-check_bar { border: ${options.border}; } `

        if (options.borderRadius) css += `${idText} progress.${Config.frames.class_prefix}strength-check_bar { border-radius: ${options.borderRadius}; } `

        if (options.backgroundColor)
            css +=
                `${idText} progress.${Config.frames.class_prefix}strength-check_bar { background-color: ${options.backgroundColor};} ` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_bar::-webkit-progress-bar { background-color: ${options.backgroundColor}; } ` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_very-weak::-webkit-progress-value { background-color: ${options.backgroundColor}; } ` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_very-weak::-moz-progress-bar { background-color: ${options.backgroundColor}; }`

        if (options.weakColor)
            css +=
                `${idText} progress.${Config.frames.class_prefix}strength-check_weak::-webkit-progress-value { background-color: ${options.weakColor}; } ` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_weak::-moz-progress-bar { background-color: ${options.weakColor}; }`

        if (options.mediumColor)
            css +=
                `${idText} progress.${Config.frames.class_prefix}strength-check_medium::-webkit-progress-value { background-color: ${options.mediumColor}; } ` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_medium::-moz-progress-bar { background-color: ${options.mediumColor}; }`

        if (options.strongColor)
            css +=
                `${idText} progress.${Config.frames.class_prefix}strength-check_strong::-webkit-progress-value { background-color: ${options.strongColor}; }` +
                `${idText} progress.${Config.frames.class_prefix}strength-check_strong::-moz-progress-bar { background-color: ${options.strongColor}; }`

        return css
    }

    appendToHead() {
        if (!this.styleElement) return

        const head = document.head || document.getElementsByTagName('head')[0]
        head.appendChild(this.styleElement)
    }

    getNextId() {
        return `${Config.frames.class_prefix}strength-check_${ this.lastId++ }`;
    }
}
