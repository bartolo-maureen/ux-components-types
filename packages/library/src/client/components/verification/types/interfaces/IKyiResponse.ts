export class IKyiResponse {
    params: {
        accessToken: string
        externalUserId: string
        identityType: string
        kycProviderKey: string

        // deprecated
        verificationFlow: string
    }
}
