let displayCardPinComponentExample;
let displayCvvComponentExample;

const allSecureDisplayComponentInstancesExamples = []
const CARD_PIN = 'Jelwi8F0L4YBhOa8Kr4AUw=='
const CVV = 'iIY52y89PwUBc4/JfQ8ACA=='


function initDisplayCardPinExample(options) {
    const _component = WeavrComponents.display.cardPin(CARD_PIN,
        {
            ...options
        }
    );

    displayCardPinComponentExample = _component
    allSecureDisplayComponentInstancesExamples.push(displayCardPinComponentExample)

    _component.mount('#display_card_pin-example')
}

function initDisplayCvvExample(options) {
    const _component = WeavrComponents.display.cvv(CVV,
        {
            ...options
        }
    );

    displayCvvComponentExample = _component
    allSecureDisplayComponentInstancesExamples.push(displayCvvComponentExample)

    _component.mount('#display_cvv-example')
}

function updateDisplayCvvExample(newOptions){
    eval('var newOptionsObj='+newOptions);
    displayCvvComponentExample.update(
        newOptionsObj
    );
}

function overrideDisplayCvvExample(newOptions){
    eval('var newOptionsObj='+newOptions);
    displayCvvComponentExample.overrideOptions(
        newOptionsObj
    );
}
