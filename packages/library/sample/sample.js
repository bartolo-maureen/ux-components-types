function initComponents(hasToken) {
    if (!hasToken) {
        initPasswordComponent()
        initPassCodeComponent()
    } else {
        initCardPinComponent()
        initBeneficiaryKyc()
        initConsumerKyc()
        initCorporateKyb()
    }
}


