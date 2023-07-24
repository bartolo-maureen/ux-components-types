let passwordComponentStateExample;
let passcodeComponentStateExample;
let cardPinComponentStateExample;

const allSecureInputComponentInstancesExamples = []

function initCapturePasswordExample(options) {
    const _component = WeavrComponents.capture.password(
        'capture_password_example', // Todo: this is useless when creating direct
        {
            ...options
        }
    );

    passwordComponentStateExample = _component
    allSecureInputComponentInstancesExamples.push(passwordComponentStateExample)

    _component.mount('#input_capture_password-example')
}

function initCapturePasscodeExample(options) {
    const _component = WeavrComponents.capture.passCode(
        'capture_passcode_example', // Todo: this is useless when creating direct
        {
            ...options,
            placeholder: 'Enter Passcode'
        }
    );

    passcodeComponentStateExample = _component
    allSecureInputComponentInstancesExamples.push(passcodeComponentStateExample)

    _component.mount('#input_capture_passcode-example')
}

function initCaptureSegmentedPasscodeExample(options) {
    const _component = WeavrComponents.capture.passCode(
        'capture_passcode_example', // Todo: this is useless when creating direct
        {
            segmented: true,
            ...options,
            placeholder: '0'
        }
    );

    passcodeComponentStateExample = _component
    allSecureInputComponentInstancesExamples.push(passcodeComponentStateExample)

    _component.mount('#input_capture_segmented-passcode-example')
}

function initCaptureCardPinExample(options) {

    const _component = WeavrComponents.capture.cardPin(
        'capture_card_pin_example', // Todo: this is useless when creating direct
        {
            ...options,
            placeholder: 'Enter Card Pin'
        }
    );

    cardPinComponentStateExample = _component
    allSecureInputComponentInstancesExamples.push(cardPinComponentStateExample)

    _component.mount('#input_capture_card_pin-example')

}

function updateCapturePasswordExample(newOptions){
    eval('var newOptionsObj='+newOptions);
    passwordComponentStateExample.update(
        newOptionsObj
    );
}

function overrideCapturePasswordExample(newOptions){
    eval('var newOptionsObj='+newOptions);
    passwordComponentStateExample.overrideOptions(
        newOptionsObj
    );
}
