(function () {
    /**
     * @type {HTMLFormElement}
     */
    const form = getElement('form_display_card-pin')
    /**
     * @type {HTMLInputElement}
     */
    const formInput = getElement('input_display_card-pin')

    form.onsubmit = function (e) {
        e.preventDefault()

        const cardPin = formInput.value
        const displayCardPin = WeavrComponents.display.cardPin(cardPin)
        displayCardPin.mount('#response_display_card-pin')
    }
})()
