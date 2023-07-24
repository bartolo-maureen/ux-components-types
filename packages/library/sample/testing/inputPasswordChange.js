const form = WeavrComponents.form()

const oldPassword = form.password('oldPassword1', { placeholder: 'Old Password'})
oldPassword.mount('#input-password-old')
const newPassword = form.password('newPassword1', { placeholder: 'New Password'})
newPassword.mount('#input-password-new')

function inputPasswordChangeSubmit() {
    form.createToken().then(res => {
        document.getElementById('inputPasswordChangeResponse').innerText = JSON.stringify(res)
    }).catch(err => {
        document.getElementById('inputPasswordChangeResponse').innerText = 'Error: ' + err.message
    })
}
