import { ClientFramesManager } from '@/client/frame/clientFramesManager'
import { FrameActionEnum } from '@/shared/types'
import { ISecureElementStyleWithPseudoClass } from '../../shared/style/types'
import {
    SecureElementStyleWithPseudoClassesOptionValidator
} from '../../shared/style/validators/secureElementStyleWithPseudoClassesOptionValidator'
import { Utils } from '@/shared/utils'
import { RootReportIframeHeightUpdate, RootReportWrapperHeightMismatch } from './rootReport'
import { ElementAlreadyDestroyedError, ElementAlreadyMountedError, InvalidSelectorError } from '@/client/errors'
import { ISecureElement } from './types'

export abstract class SecureElement {

    abstract element: ISecureElement

    get manager() {
        return ClientFramesManager.getInstance()
    }

    protected applyStyleImportant(
        element: HTMLElement,
        style: any
    ) {
        element.style.cssText = Object.keys(style).map(key => key + ': ' + style[key] + ' !important;').join(' ')
    }

    protected updateElementFrameStyle(style: any) {
        Object.keys(style).forEach(key => (this.element.frame.iframe.style as any)[key] = style[key])
    }


    protected focusElementFrame() {
        if (this.element.frame.loaded) {
            this.element.frame.sendOrQueue({
                action: FrameActionEnum.Focus,
                payload: {}
            })
        }
    }

    protected updateElementFrame(payload?: any) {
        this.element.frame.sendOrQueue({
            action: FrameActionEnum.Update,
            payload: payload
        })
    }


    protected appendFrameTo(el: HTMLElement) {
        el.appendChild(this.element.frame.iframe)
    }

    protected checkElementDestroyed() {
        if (this.element.destroyed) {
            throw new ElementAlreadyDestroyedError()
        }
    }

    protected get isMounted(): boolean {
        return !!document.body && document.body.contains(this.element.component)
    }

    protected updateElementFrameHeight(
        style?: ISecureElementStyleWithPseudoClass,
        force?: boolean
    ) {
        style = style || new SecureElementStyleWithPseudoClassesOptionValidator()
        const height = (typeof style.height === 'string') && style.height
        const lineHeight = (typeof style.lineHeight === 'string') && style.lineHeight
        const fontSize = (typeof style.fontSize === 'string') && style.fontSize
        if (force || height || lineHeight || fontSize) {
            const determinedHeight = height || this.determineHeight(lineHeight || this.element.lastHeight, fontSize || this.element.lastFontSize)
            this.updateElementFrameStyle({ height: determinedHeight })
            this.element.lastFontSize = fontSize || this.element.lastFontSize
            this.element.lastHeight = lineHeight || this.element.lastHeight
        }
    }

    protected registerElementDimensionsListener() {
        this.element.frame.eventEmitter.on('dimensions', event => {
            if (this.element.parent) {
                var parentStyle = window.getComputedStyle(this.element.parent)
                if (parentStyle) {
                    let height = parseFloat(parentStyle.getPropertyValue('height'))
                    if ('border-box' === parentStyle.getPropertyValue('box-sizing')) {
                        const paddingTop = parseFloat(parentStyle.getPropertyValue('padding-top'))
                        const paddingBottom = parseFloat(parentStyle.getPropertyValue('padding-bottom'))
                        const borderTop = parseFloat(parentStyle.getPropertyValue('border-top'))
                        const borderBottom = parseFloat(parentStyle.getPropertyValue('border-bottom'))
                        height = height - borderTop - borderBottom - paddingTop - paddingBottom
                    }
                    if ((height !== 0) && (Utils.parseFloatFixed(height) < Utils.parseFloatFixed(event.height))) {
                        this.manager.reportToRootFrame(new RootReportWrapperHeightMismatch(event.height, height))
                    }
                    const componentheight = this.element.component.getBoundingClientRect().height
                    if ((componentheight !== 0) && (event.height !== 0) && (Utils.parseFloatFixed(componentheight) !== Utils.parseFloatFixed(event.height))) {
                        this.updateElementFrameStyle({ height: event.height + 'px' })
                        this.manager.reportToRootFrame(new RootReportIframeHeightUpdate(event.height, componentheight))
                    }
                }
            }
        })
    }


    protected determineHeight(
        cssLineHeight?: string,
        cssFontSize?: string
    ): string {
        cssLineHeight = cssLineHeight || '1.2em';
        if (/^[0-9.]+px$/.test(cssLineHeight)) {
            return cssLineHeight;
        }
        const BODY_FONT_SIZE = '14px';
        cssFontSize = cssFontSize || BODY_FONT_SIZE;
        const numberLineHeight = parseFloat(cssLineHeight.toString().replace(/[^0-9.]/g, ''));
        let numberFontSize = parseFloat(cssFontSize.toString().replace(/[^0-9.]/g, ''));
        if (!/^[0-9.]+px$/.test(cssFontSize)) {
            // convert em to px
            numberFontSize *= parseFloat(BODY_FONT_SIZE.replace(/[^0-9.]/g, ''));
        }
        const calculated = numberLineHeight * numberFontSize + 'px';
        return /^[0-9.]+px$/.test(calculated) ? calculated : '100%';
    }

    protected findFocusTarget(
        direction: 'previous' | 'next'
    ) {
        var enabledFocusable: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll('a[href], area[href], input:not([disabled]),\n  select:not([disabled]), textarea:not([disabled]), button:not([disabled]),\n  object, embed, *[tabindex], *[contenteditable]'))
        var elementsInTabOrder: HTMLElement[] = []
        enabledFocusable.forEach(el => {
            var tabIndex = el.getAttribute('tabindex')
            var posOrNoTabIndex = !tabIndex || parseInt(tabIndex, 10) >= 0
            var rect = el.getBoundingClientRect()
            var hasSize = rect.width > 0 && rect.height > 0
            if (posOrNoTabIndex && hasSize) {
                elementsInTabOrder.push(el)
            }
        })

        var index = -1
        for (var i = 0; i < elementsInTabOrder.length; i++) {
            if ((elementsInTabOrder[i] === this.element.component) || (this.element.component.contains(elementsInTabOrder[i]))) {
                index = i
                break
            }
        }

        return elementsInTabOrder[index + ('previous' === direction ? -1 : 1)]
    }

    protected determineContainer(
        el: HTMLElement | string
    ): HTMLElement {
        this.checkElementDestroyed()
        if (!el) {
            throw new InvalidSelectorError()
        }
        let container: any

        if (typeof el == 'string') {
            const matches = document.querySelectorAll(el)
            if (matches.length > 1) {
                window.console && console.warn('Found ' + matches.length + ' matches - using first')
            } else if (!matches.length) {
                throw new InvalidSelectorError()
            }
            container = matches[0]
        } else {
            if (!el.appendChild) {
                throw new InvalidSelectorError()
            }
            container = el
        }
        if ('INPUT' === container.nodeName) {
            //'Can only mount in elements that can contain child elements e.g. div'
            throw new InvalidSelectorError()
        }
        if (container.children.length) {
            window.console && console.warn('Mounted to an element that contains child nodes which will be removed')
        }

        return container
    }

    mount(el: HTMLElement | string): this {
        const container = this.determineContainer(el)
        if (container === this.element.component.parentElement) {
            if (!this.isMounted) {
                this.unmount()
                this.mountTo(container)
            }
        } else if (this.element.component.parentElement) {
            if (!this.isMounted) {
                this.unmount()
                this.mountTo(container)
            } else {
                throw new ElementAlreadyMountedError()
            }
        } else {
            this.mountTo(container)
        }
        return this
    }

    protected unmount() {
        this.element.frame.loaded = false
    }

    protected blur() {
        if (this.element.frame.loaded) {
            this.element.frame.iframe.contentWindow.blur()
            this.element.frame.iframe.blur()
        }
    }

    protected clear() {
        this.element.frame.sendOrQueue({ action: FrameActionEnum.Clear, payload: {} })
    }

    protected mountTo(el: HTMLElement) {
        const elStyle = window.getComputedStyle(el)
        const rtl = !!elStyle && 'rtl' === elStyle.getPropertyValue('direction')
        this.element.parent = el
        while (el.firstChild) {
            el.removeChild(el.firstChild)
        }
        el.appendChild(this.element.component)

        this.element.frame.sendOrQueue(
            {
                action: FrameActionEnum.Mount,
                payload: {
                    rtl: rtl
                }
            }
        )

    }

    protected get isDestroyed(): boolean {
        return this.element.destroyed
    }

    public addListener(
        event: string,
        listener: (...args: any[]) => void
    ): this {
        this.element.eventEmitter.addListener(event, listener)
        return this
    }

    removeListener(
        event: string,
        listener: (...args: any[]) => void
    ): this {
        this.element.eventEmitter.removeListener(event, listener)
        return this
    }

    removeAllListeners(event?: string): this {
        this.element.eventEmitter.removeAllListeners(event)
        return this
    }

    on(
        event: string,
        listener: (...args: any[]) => void
    ): this {
        return this.addListener(event, listener)
    }

    public off(
        event: string,
        listener: (...args: any[]) => void
    ): this {
        return this.removeListener(event, listener)
    }
}
