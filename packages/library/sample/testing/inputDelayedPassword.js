const initButton = document.getElementById('delayedPassword')
initButton.addEventListener('click', initDelayedPassword)

let passDelayed

function initDelayedPassword() {
    passDelayed = WeavrComponents.capture.password('delayedPass', {
        placeholder: 'Delayed Password'
    });
    passDelayed.mount('#input-password-delayed')
}

function inputDelayedPassSubmit() {
    if(!passDelayed) {
        document.getElementById('inputPasswordDelayedResponse').innerText = 'Delayed Pass is not initialised'
        return
    }
    passDelayed.createToken().then(res => {
        console.trace('Res:', res)
        document.getElementById('inputPasswordDelayedResponse').innerText = JSON.stringify(res)
    }).catch(err => {
        console.trace('Error:', err)
        document.getElementById('inputPasswordDelayedResponse').innerText = JSON.stringify(err)
    })
}
