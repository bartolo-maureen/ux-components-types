const UI_KEY = 'cfE2+PcFh20BbxPI9+IACQ=='
const WeavrComponents = window.weavr.init(UI_KEY)

function loggedIn() {
    document.dispatchEvent(new Event('logged-in'))
}
