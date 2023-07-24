const initCorporateKyb = function () {
    const form = document.getElementById('form_capture_corporate-kyb_options');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const referenceInput = getElement('option_capture_corporate-kyb_ref');
        const referenceId = referenceInput.value || undefined

        if (!referenceId) {
            console.error('Reference ID is not set for Corporate KYC')
        } else {
            const langInput = getElement('option_capture_corporate-kyb_lang');
            const lang = langInput.value || 'en'

            init({ referenceId, lang })
        }
    });

    function init(options) {
        WeavrComponents.capture.corporateKyb(options.referenceId).mount(
            '#input_capture_corporate-kyb',
            {
                lang: options.lang || 'en'
            }
        );
    }

}
