const initBeneficiaryKyc = function () {
    const form = document.getElementById('form_capture_beneficiary-kyc_options');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const referenceInput = getElement('option_capture_beneficiary-kyc_ref');
        const referenceId = referenceInput.value || undefined

        if (!referenceId) {
            console.error('Reference ID is not set for Beneficiary KYC')
        } else {
            const langInput = getElement('option_capture_beneficiary-kyc_lang');
            const lang = langInput.value || 'en'

            init({ referenceId, lang })
        }
    });

    function init(options) {
        WeavrComponents.capture.beneficiariesKyc(options.referenceId).mount(
            '#input_capture_beneficiary-kyc',
            {
                lang: options.lang || 'en'
            }
        );
    }

}
