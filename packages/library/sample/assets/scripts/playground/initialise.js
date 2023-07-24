const disableStateBtn = getElement('disabled-state-toggle')
const disableStateBtnListener = () => (disableStateBtn.addEventListener('change', updateInputState))
isElementAvailable(disableStateBtn, 'disabled-state-toggle', disableStateBtnListener)

function updateInputState(e) {
    const checked = e.target.checked


    allSecureInputComponentInstancesExamples.forEach((/*CardPinInputComponent || PassCodeInputComponent || PasswordInputComponent  */ instance) => {
        instance.update({
            placeholder: checked ? '---disabled---' : (instance.options.placeholder || 'Placeholder'),
            disabled: checked ? true : false,
        })
    })

}
