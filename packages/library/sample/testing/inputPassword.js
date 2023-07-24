let token = ''

const pass1 = WeavrComponents.capture.password('password1', {
    placeholder: 'Password'
});
pass1.mount('#input-password')

function inputPasswordSubmit() {
    pass1.createToken().then(res => {
        document.getElementById('inputPasswordResponse').innerText = JSON.stringify(res)

        login(document.getElementById('username').value, res.tokens.password1).then(res => {
            token = res
            WeavrComponents.setUserToken('Bearer ' + token).then(() => {
                loggedIn()
            })
        })
    }).catch(err => {
        document.getElementById('inputPasswordResponse').innerText = JSON.stringify(err)
    })
}

function login(username, tokenisedPassword) {
    return fetch('https://qa.onvirtual.cards/proxy/multi/login_with_password', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password: { value: tokenisedPassword }
        }),
    })
        .catch(e => {
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            return res.token
        })
}
