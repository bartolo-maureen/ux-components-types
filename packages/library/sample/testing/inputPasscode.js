const passCode1 = WeavrComponents.capture.passCode('passcode1', {
    placeholder: 'Passcode'
});
passCode1.mount('#input-passcode')

function inputPasscodeSubmit() {
    passCode1.createToken().then(res => {
        console.trace('Res:', res)
        document.getElementById('inputPasscodeResponse').innerText = JSON.stringify(res)
    }).catch(err => {
        console.trace('Error:', err)
        document.getElementById('inputPasscodeResponse').innerText = JSON.stringify(err)
    })
}
