function displayCardPinSubmit() {
    const input = document.getElementById('i-cardPin').value
    const displayPin = WeavrComponents.display.cardPin(input)
    displayPin.mount('#display-cardPin')
}
