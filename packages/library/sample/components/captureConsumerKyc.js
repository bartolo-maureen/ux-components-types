const initConsumerKyc = function () {
    const form = document.getElementById('form_capture_consumer-kyc_options');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const referenceInput = getElement('option_capture_consumer-kyc_ref');
        const referenceId = referenceInput.value || undefined

        if (!referenceId) {
            console.error('Reference ID is not set for Consumer KYC')
        } else {
            const langInput = getElement('option_capture_consumer-kyc_lang');
            const lang = langInput.value || 'en'

            init({ referenceId, lang })
        }
    });

    function init(options) {
        WeavrComponents.capture.consumerKyc(options.referenceId).mount(
            '#input_capture_consumer-kyc',
            {
                lang: options.lang || 'en'
            }
        );
    }

}
