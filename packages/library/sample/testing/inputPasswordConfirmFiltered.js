const formFilteredConfirm = WeavrComponents.form()

const origFilteredPassword = formFilteredConfirm.password('origPassword', {
    placeholder: 'Password'
})
origFilteredPassword.mount('#input-filtered-password-orig')
const confirmFilteredPassword = formFilteredConfirm.password(
    'confirmPassword',
    {
        placeholder: 'Confirm Password'
    }
)
confirmFilteredPassword.mount('#input-filtered-password-confirm')
const otherPassword = formFilteredConfirm.password('otherPassword', {
    placeholder: 'Other Password'
})
otherPassword.mount('#input-filtered-password-other')

function inputPasswordConfirmFilteredSubmit() {
    formFilteredConfirm
        .match(['confirmPassword', 'origPassword'])
        .then(() => {
            document.getElementById(
                'inputPasswordConfirmFilteredResponse'
            ).innerText = 'Match'
        })
        .catch((err) => {
            console.error('Error:', err.message)
            document.getElementById(
                'inputPasswordConfirmFilteredResponse'
            ).innerText = 'ERROR: ' + err.message
        })
}

function inputPasswordConfirmFilteredTokenize() {
    formFilteredConfirm
        .createToken()
        .then((res) => {
            document.getElementById(
                'inputPasswordConfirmFilteredTokenizeResponse'
            ).innerText = JSON.stringify(res)
        })
        .catch((err) => {
            document.getElementById(
                'inputPasswordConfirmFilteredTokenizeResponse'
            ).innerText = 'Error: ' + err.message
        })
}
