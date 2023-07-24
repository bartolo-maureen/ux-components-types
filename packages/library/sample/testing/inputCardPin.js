let pin1;

function initCardPin() {
    pin1 = WeavrComponents.capture.cardPin('pin1', {
        placeholder: 'Card Pin'
    })
    pin1.mount('#input-pin')
}

function inputPinTokenizeSubmit() {
    if(!pin1) {
        document.getElementById('inputPinResponse').innerText = 'Pin is not initialised'
        return
    }
    pin1.createToken().then(res => {
        document.getElementById('inputPinResponse').innerText = JSON.stringify(res)
    }).catch(err => {
        document.getElementById('inputPinResponse').innerText = JSON.stringify(err)
    })
}

document.addEventListener('logged-in', initCardPin, { once: true })
