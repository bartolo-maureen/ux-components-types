

const inputComponentOptions = {
    placeholder: 'Enter Password',
    validationMode: 'onTouch',
    // classNames: {s
    //     base: 'test-class-name-1'
    // },
    style: {
        base: {
            borderRadius: '15px',
            border: 'black 2px solid',
            padding: '1rem',
            fontSize: '16px',
            fontFamily: '"Mynerve"',
            '::placeholder': {
                fontFamily: '"Mynerve"',
            },
            ':disabled': {
                fontWeight: '900',
            },
            ':focus': {
                backgroundColor: 'blue',
                color: 'white'
            },
        },
        empty: {
            backgroundColor: 'yellow',
            ':focus': {
                backgroundColor: 'blue',
                color: 'white'
            },
        },
        invalid: {
            backgroundColor: 'red',
            ':focus': {
                backgroundColor: 'blue',
                color: 'white'
            },
        },
        valid: {
            backgroundColor: 'green',
            ':focus': {
                backgroundColor: 'blue',
                color: 'white'
            },
        }
    }
}

/**
 * @type { ISecureSpanOptions}
 */
const displayComponentOptions = {
    // className: 'test-class-name-2',
    style: {
        color: 'red',
        fontFamily: 'Fuggles',
        backgroundColor: 'yellow',
        fontSize: '2rem',
        ':hover':{
            backgroundColor: 'green',
            color: 'blue',
            fontFamily: 'Arial',
            fontSize: '1rem',
        },
    }
}


function initStateComponents(hasToken) {
    if (!hasToken) {
        //Input Components
        initCapturePasswordExample(inputComponentOptions)
        initCapturePasscodeExample(inputComponentOptions)
        initCaptureSegmentedPasscodeExample(inputComponentOptions)
    }
    else {
        //Input Components
        initCaptureCardPinExample(inputComponentOptions)

        //Display Components
        initDisplayCardPinExample(displayComponentOptions)
        initDisplayCvvExample(displayComponentOptions)
    }
}


function hideInitMessage() {
    const weavrComponentsNotIntiContainer = getElement('weavr-components-not-initalised')
    weavrComponentsNotIntiContainer.style.display = 'none'

    const weavrComponentsIntiContainer = getElement('weavr-components-initalised')
    weavrComponentsIntiContainer.style.display = 'block'
}
