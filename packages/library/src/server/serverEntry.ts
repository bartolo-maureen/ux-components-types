import { Root } from './components/root'
import { SecureInputOptionValidator } from './components/elements/input/secureInputOptionValidator'
import { SecureInput } from './components/elements/input/secureInput'
import { SecureSpan } from './components/elements/span/secureSpan'
import { SecureSpanOptionValidator } from './components/elements/span/secureSpanOptionValidator'
import { InternalError } from './errors'
import { HashParamTypeEnum, IHashParam } from './types'

export class ServerEntry {
    constructor() {
        if (window.self === window.top) {
            // Elements must be used within an IFRAME.
            throw new InternalError()
        } else {

            switch (this.hashParams.type) {
                case HashParamTypeEnum.Root:
                    new Root()
                    break
                case HashParamTypeEnum.Input:
                    this.createInput()
                    break
                case HashParamTypeEnum.Span:
                    this.createSpan()
                    break
            }
        }
    }

    createInput() {

        const options = new SecureInputOptionValidator(this.hashParams)

        options.validate()
            .then(() => {
                new SecureInput(options)
            })
    }

    createSpan() {
        const options = new SecureSpanOptionValidator(this.hashParams)

        if (options.isValid()) {
            new SecureSpan(options)
        }
    }

    get hashParams(): IHashParam {
        const locationHash = window.location.href.split('#')[1]
        const parsed: IHashParam = {}
        locationHash.replace(/\+/g, ' ').split('&').forEach((
            e,
            t
        ) => {
            const keyValueSplit = e.split('=')
            let key = decodeURIComponent(keyValueSplit[0])
            let splitKey = key.split('][')
            let numKey = splitKey.length - 1

            if (/\[/.test(splitKey[0]) && /\]$/.test(splitKey[numKey])) {
                splitKey[numKey] = splitKey[numKey].replace(/\]$/, '') // remove ] from z]
                splitKey = splitKey.shift().split('[').concat(splitKey) // split a[b in a,b and append the rest
                numKey = splitKey.length - 1
            } else {
                numKey = 0
            }
            if (keyValueSplit.length === 2) {
                const value = decodeURIComponent(keyValueSplit[1])
                if (numKey) {
                    let tmp: any | any[] = parsed
                    for (let i = 0; i <= numKey; i++) {
                        // treat [x] or [1] as specific property or index, [] as next index
                        key = splitKey[i] === '' ? tmp.length : splitKey[i]
                        tmp[key] = i < numKey ? tmp[key] || (splitKey[i + 1] && isNaN(Number(splitKey[i + 1])) ? {} : []) : value
                        tmp = tmp[key]
                    }
                } else if (parsed[key]) {
                    // maintain array only for top level keys (nested arrays should use [])
                    const existing = parsed[key]
                    Array.isArray(existing) ? existing.push(value) : parsed[key] = [ existing, value ]
                } else {
                    parsed[key] = value
                }
            } else {
                key && (parsed[key] = '')
            }
        })
        return parsed
    }
}
