import { IAutocorrectResult } from './types'
import { ISecureElementStyleFont } from '@/shared/types'
import {
    ISecureElementStateStyle,
    ISecureElementStyle,
    ISecureElementStyleWithPseudoClass
} from '@/client/components/shared/style/types'

export const FIELD_UTILS = {
    FONT_PROP_KEYS: {
        family: 'font-family',
        src: 'src',
        unicodeRange: 'unicode-range',
        style: 'font-style',
        variant: 'font-variant',
        stretch: 'font-stretch',
        weight: 'font-weight',
        display: 'font-display'
    },

    VARIANTS: {
        _base: '',
        _empty: '.is-empty',
        _valid: '.is-valid',
        _invalid: '.is-invalid'
    },

    CSS_PROPS: {
        color: 'color',
        fontFamily: 'font-family',
        fontSize: 'font-size',
        fontSmoothing: '-webkit-font-smoothing',
        fontStyle: 'font-style',
        fontVariant: 'font-variant',
        fontWeight: 'font-weight',
        height: 'height',
        letterSpacing: 'letter-spacing',
        lineHeight: 'line-height',
        margin: 'margin',
        padding: 'padding',
        textAlign: 'text-align',
        textDecoration: 'text-decoration',
        textIndent: 'text-indent',
        textShadow: 'text-shadow',
        textTransform: 'text-transform',
        backgroundColor: 'background-color',
        border: 'border',
        borderRadius: 'border-radius'
    },

    // 0 = digit
    // A = character (corrected to uppercase)
    // a = character (corrected to lowercase)
    // * = any character or digit (left as is)
    autocorrect: function (
        autocorrectPattern: string,
        value: string,
        selection?: { start: number, end: number },
        delKey?: 'Delete' | 'Backspace'
    ): IAutocorrectResult {
        value = value || '';
        selection = selection || { start: 0, end: 0 };

        let newFormatted = '';
        let start = selection.start;
        let end = selection.end;

        function updateSelection(delta: number) {
            if (start >= newFormatted.length + pendingFormatting.length - delta) {
                start += delta;
            }
            if (end >= newFormatted.length + pendingFormatting.length - delta) {
                end += delta;
            }
        }

        const patternLength = Math.floor(autocorrectPattern.length / 2);

        let pendingFormatting = '';
        let newValue = '';
        let valid = false;
        let pos = 0;
        let i = 0;

        outer:
            while (i < patternLength) {
                const pattern = autocorrectPattern.charAt(i);
                const meta = autocorrectPattern.charAt(patternLength + i);

                switch (meta) {
                    case '?':
                        valid = true;
                    case ' ':
                        let regex: RegExp;
                        switch (pattern) {
                            case '0':
                                regex = /^[0-9]$/;
                                break;
                            case 'A':
                                regex = /^[A-Z]$/;
                                break;
                            case 'a':
                                regex = /^[a-z]$/;
                                break;
                            default:
                                regex = /^[0-9A-Za-z]$/;
                        }
                        if (value.charAt(pos).match(regex)) {
                            newFormatted += pendingFormatting + value.charAt(pos);
                            pendingFormatting = '';
                            newValue += value.charAt(pos);
                            pos++;
                            i++;
                        } else {
                            delKey = null;
                            pos++;
                            updateSelection(-1);
                        }

                        if (pos >= value.length) {
                            break outer;
                        }

                        break;
                    case 'F':
                        if (value.charAt(pos) === pattern) {
                            pendingFormatting += pattern;
                            pos++;
                            i++;
                        } else if (delKey === 'Delete') {
                            pendingFormatting += pattern;
                            pos++;
                            i++;
                            delKey = null;
                        } else if (delKey === 'Backspace') {
                            if (newFormatted.length > 0) {
                                newFormatted = newFormatted.slice(0, newFormatted.length - 1);
                                newValue = newValue.slice(0, newValue.length - 1);
                                i -= pendingFormatting.length + 1;
                                pendingFormatting = '';
                                updateSelection(-1);
                            } else {
                                pendingFormatting += pattern;
                                pos++;
                                i++;
                            }
                            delKey = null;
                        } else {
                            pendingFormatting += pattern;
                            updateSelection(1);
                            i++;
                        }
                        break;
                    default:
                        break;
                }
            }

        valid = valid || i === patternLength;


        return {
            formatted: newFormatted + pendingFormatting,
            value: newValue,
            selection: {
                start: start,
                end: end
            },
            valid: valid
        }
    },

    renderFontsCss: function (fonts?: ISecureElementStyleFont[]): string {
        let rendered = '';
        fonts && fonts.forEach(font => {
            let renderedFont = '';
            if (font?.src?.match(/^url\("?'?https:\/\/[#?&=;,a-zA-Z0-9-+_\/.:@]*"?'?\)+$/)) {
                rendered += `@import ${font.src};\n\n`;
            } else {
                Object.keys(font).forEach(key => {
                    renderedFont += (FIELD_UTILS.FONT_PROP_KEYS as any)[key] + ': ' + (font as any)[key] + ';';
                });
                rendered += '@font-face {' + renderedFont + '}\n\n';
            }
        });
        return rendered;
    },
    renderStyleCss: function (style?: ISecureElementStateStyle): string {
        let rendered = '';
        style && Object.keys(style).forEach(key => {
            rendered += FIELD_UTILS.renderStyleVariant(key, (style as any)[key]);
        });
        return rendered;
    },

    renderStyleVariant: function (
        variant: string,
        style: ISecureElementStyleWithPseudoClass
    ) {
        let rendered = '';
        const renderedStyle = FIELD_UTILS.renderCssProperties(style);
        FIELD_UTILS.determineCssSelectors(variant, undefined, false).map(selector => {
            rendered += selector + ' {\n' + renderedStyle + '}\n';
        });
        Object.keys(style).map(key => {
            if (!(key in FIELD_UTILS.CSS_PROPS)) {
                const renderedPseudo = FIELD_UTILS.renderCssProperties((style as any)[key]);
                FIELD_UTILS.determineCssSelectors(variant, key, false).map(selector => {
                    rendered += selector + ' {\n' + renderedPseudo + '}\n';
                    // @ts-ignore
                    Object.keys(style[key]).map(pseudoKey => {
                        if (!(pseudoKey in FIELD_UTILS.CSS_PROPS)) {
                            // @ts-ignore
                            rendered += FIELD_UTILS.renderStyleVariantInnerPseudo(variant, style[key], pseudoKey, selector)
                        }
                    })
                });
            }
        });
        return rendered;
    },

    renderStyleVariantInnerPseudo: function (
        variant: string,
        style: ISecureElementStyleWithPseudoClass,
        pseudoKey: string,
        selector: string
    ) {
        let rendered = '';
        // @ts-ignore
        const renderedPseudo = FIELD_UTILS.renderCssProperties((style as ISecureElementStyleWithPseudoClass)[pseudoKey]);
        FIELD_UTILS.determineCssSelectors(variant, pseudoKey, true).map(innerSelector => {
            rendered += selector + innerSelector + ' {\n' + renderedPseudo + '}\n';
            // @ts-ignore
            Object.keys(style[pseudoKey]).map(innerPseudoKey => {
                if (!(innerPseudoKey in FIELD_UTILS.CSS_PROPS)) {
                    let tempSelector = selector + innerSelector
                    // @ts-ignore
                    rendered += FIELD_UTILS.renderStyleVariantInnerPseudo(variant, style[pseudoKey], innerPseudoKey, tempSelector)
                }
            })
        });
        return rendered
    },

    determineCssSelectors: function (
        variant: string,
        pseudo?: string,
        innerPseudo?: boolean,
    ): string[] {
        let sel = innerPseudo ? '' : '.secure-element__element' + ((FIELD_UTILS.VARIANTS as any)[variant] || '');

        if (pseudo) {
            switch (pseudo) {
                case '::placeholder':
                case '_::placeholder':
                    return [ sel + '::-webkit-input-placeholder', sel + '::-moz-placeholder', sel + ':-ms-input-placeholder', sel + '::placeholder' ];
                case '::selection':
                case '_::selection':
                    return [ sel + '::-moz-selection', sel + '::selection' ];
                case ':focus':
                case '_:focus':
                    return [ sel + ':focus' ];
                case ':hover':
                case '_:hover':
                    return [ sel + ':hover' ];
                case ':disabled':
                case '_:disabled':
                    return [ sel + ':disabled' ];
                case ':-webkit-autofill':
                case '_:-webkit-autofill':
                    return [ sel + ':-webkit-autofill' ];
                case ':active':
                case '_:active':
                    return [ sel + ':active' ];
                default:
                    // return empty array since no selector matches otherwise the styling will apply to the root element
                    return [];
            }
        }

        return [ sel ];
    },

    renderCssProperties: function (style: ISecureElementStyle): string {
        return Object.keys(style).map(key => {
            if (key in FIELD_UTILS.CSS_PROPS) {
                if (key === 'fontSmoothing' && ('antialiased' === style.fontSmoothing || 'grayscale' === style.fontSmoothing)) {
                    return '  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n';
                }
                return '  ' + (FIELD_UTILS.CSS_PROPS as any)[key] + ': ' + (style as any)[key] + ';\n';
            }
        }).join('');
    }
}
