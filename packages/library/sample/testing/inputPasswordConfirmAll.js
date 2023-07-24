const formConfirm = WeavrComponents.form()

const origPassword = formConfirm.password('origPassword', {
    placeholder: 'Password'
})
origPassword.mount('#input-password-orig')
const confirmPassword = formConfirm.password('confirmPassword', {
    placeholder: 'Confirm Password'
})
confirmPassword.mount('#input-password-confirm')

const origPasscode = formConfirm.passCode('origPasscode', {
    placeholder: 'Passcode'
})
origPasscode.mount('#input-passcode-orig')
const confirmPasscode = formConfirm.passCode('confirmPasscode', {
    placeholder: 'Confirm Passcode'
})
confirmPasscode.mount('#input-passcode-confirm')

function inputPasswordConfirmSubmit() {
    formConfirm
        .match()
        .then(() => {
            document.getElementById('inputPasswordConfirmResponse').innerText =
                'Match'
        })
        .catch((err) => {
            console.error('Error:', err.message)
            document.getElementById('inputPasswordConfirmResponse').innerText =
                'ERROR: ' + err.message
        })
}
