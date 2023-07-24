function displayCardNumberSubmit() {
    const input = document.getElementById('i-cardNumber').value
    const displayCardNumber = WeavrComponents.display.cardNumber(input)
    displayCardNumber.mount('#display-cardNumber')
}
