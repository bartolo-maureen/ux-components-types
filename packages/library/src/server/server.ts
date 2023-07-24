// export something otherwise typescript or browserify does not include file
import { ServerEntry } from './serverEntry'

if (import.meta.env.PROD) {
    console.log = function(
        message?: any,
        ...optionalParams: any[]
    ) {
    }
    console.warn = function(
        message?: any,
        ...optionalParams: any[]
    ) {
    }

    console.error = function(
        message?: any,
        ...optionalParams: any[]
    ) {
    }

    console.time = function(label?: string) {
    }

    console.timeEnd = function(label?: string) {
    }
}

new ServerEntry()


