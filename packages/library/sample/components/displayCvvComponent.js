(function () {
    /**
     * @type {HTMLFormElement}
     */
    const form = getElement('form_display_cvv')
    /**
     * @type {HTMLInputElement}
     */
    const formInput = getElement('input_display_cvv')

    form.onsubmit = function (e) {
        e.preventDefault()

        const cvv = formInput.value
        const displayCvv = WeavrComponents.display.cvv(cvv,
            {
                style:{
                    backgroundColor: 'blue',
                    fontFamily: '"Zen Loop", "Fuggles"',
                    color: 'white',
                    fontSize: '5rem',
                }
            })

        displayCvv.mount('#response_display_cvv')
    }
})()
