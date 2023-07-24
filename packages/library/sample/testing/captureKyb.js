function  captureKybInit() {
    const refId = document.getElementById('ref-kyb').value
    if(!refId) { console.error('No ref id found'); return }

    window.weavr.capture
        .corporateKyb(refId)
        .mount('#div-kyb', {
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
