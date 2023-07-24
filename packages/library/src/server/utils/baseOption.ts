import { validateOrReject, validateSync } from 'class-validator'
import { get, isUndefined, pickBy } from 'lodash-es'


export abstract class BaseOption {

    constructor(object?: any) {
        if (object) {
            this.fill(object)
        }
    }

    public fill(object: any) {
        Object.keys(object).forEach(key => {
            this[key] = object[key]
        })
        return this
    }

    public validate() {
        return validateOrReject(this, { whitelist: true })
    }

    public validateSync() {
        return validateSync(this, { whitelist: false })
    }

    public isValid() {
        const result = validateSync(this, { whitelist: false })
        if (result.length > 0) {
            console.error(result)
            return false
        } else {
            return true
        }
    }

    protected convertAndFill<T>(
        _object: BaseOption,
        _value: T
    ): T {

        return _object.fill(_value) as any as T
    }

    public get(filter: string[]) {
        const target = {} as any

        for (let key of filter) {
            target[key] = get(this, key)
        }

        return pickBy(target, (val) => {
                return !isUndefined(val)
            }
        )
    }

}
