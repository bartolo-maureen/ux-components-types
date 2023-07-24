(function () {
    /**
     * @type {HTMLFormElement}
     */
    const form = getElement('form_display_card-number')
    /**
     * @type {HTMLInputElement}
     */
    const formInput = getElement('input_display_card-number')

    form.onsubmit = function (e) {
        e.preventDefault()

        const cardNumber = formInput.value
        try {
            const displayCardNumber =
                WeavrComponents.display.cardNumber(cardNumber);
            displayCardNumber.on("error", (e) => {
                console.log("Error", e);
            });
            displayCardNumber.mount("#response_display_card-number");
        } catch (e) {
            console.log("Error:", e.message);
        }
    }
})()
