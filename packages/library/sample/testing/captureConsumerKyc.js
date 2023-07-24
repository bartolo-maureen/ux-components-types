function  captureConsumerKycInit() {
    const refId = document.getElementById('ref-ckyc').value
    if(!refId) { console.error('No ref id found'); return }

    window.weavr.capture
        .consumerKyc(refId)
        .mount('#div-ckyc', {
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
