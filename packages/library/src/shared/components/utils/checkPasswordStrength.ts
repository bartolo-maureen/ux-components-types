export const defaultOptions = [
    {
        id: 0,
        value: "Very weak",
        minDiversity: 0,
        minLength: 0
    },
    {
        id: 1,
        value: "Weak",
        minDiversity: 2,
        minLength: 6
    },
    {
        id: 2,
        value: "Medium",
        minDiversity: 4,
        minLength: 8
    },
    {
        id: 3,
        value: "Strong",
        minDiversity: 4,
        minLength: 10
    }
]

export function passwordStrength (password: string, options = defaultOptions, allowedSymbols= "!\"#\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\\\\]\^_`\{|\}~") {

    let passwordCopy = password || ''

    options[0].minDiversity = 0,
        options[0].minLength = 0

    const rules = [
        {
            regex: "[a-z]",
            message: 'lowercase'
        },
        {
            regex: '[A-Z]',
            message: 'uppercase'
        },
        {
            regex: '[0-9]',
            message: 'number'
        },
    ]

    if (allowedSymbols) {
        rules.push({
            regex: `[${allowedSymbols}]`,
            message: 'symbol'
        })
    }

    const strength = {
        contains: rules
            .filter(rule => new RegExp(`${rule.regex}`).test(passwordCopy))
            .map(rule => rule.message),
        length: passwordCopy.length
    }

    let fulfilledOptions = options
        .filter(option => strength.contains.length >= option.minDiversity)
        .filter(option => strength.length >= option.minLength)
        .sort((o1, o2) => o2.id - o1.id)
        .map(option => ({id: option.id, value: option.value}))

    return fulfilledOptions[0];
};