const initCardPinComponent = function () {
    /**
     * @type {HTMLTextAreaElement}
     */
    const responseEl = document.getElementById('response_capture_card-pin')

    let component;

    function generatePassCodeInputToken() {
        component.createToken().then(res => {
            responseEl.value = JSON.stringify(res, null, 4)
        }).catch((e) => {
            responseEl.value = e
        });
    }

    const form = document.getElementById('form_capture_card-pin');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        generatePassCodeInputToken()
    });

    function init() {
        const _component = WeavrComponents.capture.cardPin(
            'input_capture_card-pin',
            {
                placeholder: 'Card Pin',
                style: {
                    base: {
                        fontSize: '24px',
                        fontFamily: '"Zen Loop", "Fuggles"',
                        '::placeholder': {
                            fontSize: '12px',
                            fontFamily: '"Be Vietnam"'
                        }
                    }
                }
            }
        );

        component = _component

        _component.mount('#input_capture_card-pin')

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
                generatePassCodeInputToken()
            }
        })

        _component.on('change', (e) => {
            console.warn('change', e);
        })

        _component.on('destroy', (e) => {
            console.warn('destroy', e);
        })
    }

    init()
}
