const initPasswordComponent = function () {
    /**
     * @type {HTMLTextAreaElement}
     */
    const response = document.getElementById('response_capture_password')

    let component;

    function generateInputToken() {
        component.createToken().then(res => {
            response.value = JSON.stringify(res, null, 4)
        }).catch((e) => {
            response.value = e
        });
    }

    const form = document.getElementById('form_capture_password');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generateInputToken()
    });

    function init() {
        const _component = WeavrComponents.capture.password(
            'capture_password_name', // Todo: this is useless when creating direct
            {
                placeholder: 'Password',
                strengthCheck: {
                    borderRadius: '2px',
                    strongColor: 'blue',
                    // hideText: true,
                    classNames: '',
                },
                style: {
                    base: {
                        fontSize: '24px',
                        fontFamily: '"Zen Loop", "Fuggles"',
                        '::placeholder': {
                            fontSize: '12px',
                            fontFamily: '"Be Vietnam"'
                        }
                    }
                },
            }
        );

        component = _component

        _component.mount('#input_capture_password')

        _component.on('ready', (e) => {
            console.warn('ready', e);
        })

        _component.on('focus', (e) => {
            console.warn('focus', e);
        })

        _component.on('blur', (e) => {
            console.warn('blur', e);
        })

        _component.on('keyup', (e) => {
            console.warn('keyup', e);

            if (e.key === 'Enter') {
                generateInputToken()
            }
        })

        _component.on('change', (e) => {
            console.warn('change', e);
        })

        _component.on('destroy', (e) => {
            console.warn('destroy', e);
        })

        _component.on('strength', (e) => {
            console.warn('strength', e);
        })
    }

    init()
}
