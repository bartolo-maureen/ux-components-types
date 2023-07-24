import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function Autocorrect(validationOptions?: ValidationOptions) {
    return function (
        object: Object,
        propertyName: string
    ) {
        registerDecorator({
            name: 'autocorrect',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(
                    value: any,
                    args: ValidationArguments
                ) {

                    const pattern = value.slice(0, value.length / 2);
                    const meta = value.slice(value.length / 2);
                    if (!pattern.match(/^[a-zA-Z0-9-?() #@!%]*$/)) {
                        return false
                    }
                    if (!meta.match(/^[ F]*[?F]*$/)) {
                        return false
                    }
                    return true;
                },
            },
        });
    };
}
