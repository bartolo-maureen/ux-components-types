export enum FrameActionEnum {
    Ready = 'opc-uxsec-ready',
    Destroy = 'opc-uxsec-destroy',
    Focus = 'opc-uxsec-focus',
    Update = 'opc-uxsec-update',
    Clear = 'opc-uxsec-clear',
    Mount = 'opc-uxsec-mount',
    Report = 'opc-uxsec-report',

    ElementEvent = 'opc-uxsec-element-event',
    ElementError = 'opc-uxsec-element-error',
    ElementLoad = 'opc-uxsec-element-load',
    ElementRequest = 'opc-uxsec-element-request',
    ElementRequestComplete = 'opc-uxsec-element-request-complete',
    ElementRequestError = 'opc-uxsec-element-request-error',

    CreateInput = 'opc-uxsec-create-input',
    CreateSpan = 'opc-uxsec-create-span',

    RootInit = 'opc-uxsec-root-init',
    RootLoad = 'opc-uxsec-root-load',
    RootUpdate = 'opc-uxsec-root-update',
    RootReport = 'opc-uxsec-root-report',
    RootAction = 'opc-uxsec-root-action',
    RootActionComplete = 'opc-uxsec-root-action-complete',
    RootActionError = 'opc-uxsec-root-action-error',
}
