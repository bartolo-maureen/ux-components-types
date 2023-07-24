function  captureBeneficiaryKycInit() {
    const refId = document.getElementById('ref-bkyc').value
    if(!refId) { console.error('No ref id found'); return }

    window.weavr.capture
        .beneficiariesKyc(refId)
        .mount('#div-bkyc', {
            onError: (err) => {
                console.error(err)
            },
            onMessage: (type, payload) => {
                console.log(type, payload)
            }
        })
        .then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err)
        })
}
