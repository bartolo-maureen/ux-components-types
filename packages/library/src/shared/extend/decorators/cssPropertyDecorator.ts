import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function CssProperty(validationOptions?: ValidationOptions) {
    return function (
        object: Object,
        propertyName: string
    ) {
        registerDecorator({
            name: 'cssProperty',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(
                    value: any,
                    args: ValidationArguments
                ) {
                    try {
                        return value.match(/^[#a-zA-Z0-9-_\s,"'().]*$/)
                    } catch (e) {
                        return (value + '').match(/^[#a-zA-Z0-9-_\s,"'().]*$/)
                    }
                },
            },
        });
    };
}
