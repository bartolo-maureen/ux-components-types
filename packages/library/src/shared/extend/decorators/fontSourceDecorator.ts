import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import { InvalidFontsError } from '@/server/errors'

export function FontSource(validationOptions?: ValidationOptions) {
    return function (
        object: Object,
        propertyName: string
    ) {
        registerDecorator({
            name: 'fontSource',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(
                    value: any,
                    args: ValidationArguments
                ) {
                    if (value) {
                        if (!value.match(/(?:(?:^|,)[ ]*(?:local\([-_a-zA-Z0-9\s'"]*\)|url\("?'?(?:https:\/\/|data:)[#?&=;,a-zA-Z0-9-+_\/.:]*.*"?'?\))[ ]*(?:format\("?'?[-a-zA-Z0-9]*"?'?\))?)+$/)) {
                            // 'Invalid src: ' + value;
                            throw new InvalidFontsError();
                        }

                        return value.replace(/((?:url|format)\()([^)]*)(\))/g, (
                            m0: string,
                            m1: string,
                            m2: string,
                            m3: string
                        ) => m1 + window.encodeURI(m2) + m3);
                    } else {
                        console.warn('error in font validation')
                        return true
                    }
                },
            },
        });
    };
}
