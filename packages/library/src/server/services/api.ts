import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Config } from '@/shared/config'
import { FetchRequestMethodEnum, IFieldDefinition, IProxyOption } from './types'
import { IFrameData } from '../components/types'
import { InternalError, InvalidAuthError, StepUpRequiredError } from '../errors'
import { ServerErrorCodeEnum } from '../errors/types'
import { SUPPORTED_FIELDS } from '../components/elements/types'
import { version } from "../../../package.json";

export class API {
    private static instance: API

    public random: string | null = null

    protected axiosInstance: AxiosInstance

    private constructor() {
        const config: AxiosRequestConfig = {
            baseURL: Config.base.api_url,
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json;charset=UTF-8',
                'If-Match': [`X-SDK-VERSION:${ version }`,"X-SDK-PLATFORM:WEB"]
            }
        }
        this.axiosInstance = axios.create(config)

        this.axiosInstance.interceptors.response.use(
            this.onFulfilled.bind(this),
            this.onRejected.bind(this)
        )
    }

    public static getInstance(): API {
        if (!API.instance) {
            API.instance = new API()
        }

        return API.instance
    }

    public setUiKey(uiKey: string) {
        this.axiosInstance.defaults.headers.common['programme-key'] = uiKey
    }

    public setAuthToken(auth_token: string) {
        this.axiosInstance.defaults.headers.common['authorization'] = auth_token
    }

    protected onFulfilled<V>(response: V): V | Promise<V> {
        return response
    }

    protected onRejected(error: any): any {
        switch (error.response.status) {
            case 401:
                return Promise.reject(new InvalidAuthError())
            case 403:
                if (
                    error.response.data?.errorCode ===
                    ServerErrorCodeEnum.STEP_UP_REQUIRED
                ) {
                    return Promise.reject(new StepUpRequiredError())
                }
                return Promise.reject(new InternalError())
            case 412:
                console.error('The current version you are using is not supported. Refer to our documentation for the latest versions: https://docs.weavr.io/')
            default:
                return Promise.reject(new InternalError())
        }
    }

    public fetchFont(source: string) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', source, true)

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response)
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    })
                }
            }
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
            xhr.send()
        })
    }

    public anon_tokenize(data: any) {
        const converted = this.prepare(data)
        return this.axiosInstance.post('/anon_tokenize', {
            values: converted.data
        })
    }

    public associate(): Promise<AxiosResponse<{ random: string }>> {
        return this.axiosInstance.post('/associate')
    }

    public proxy(options: IProxyOption) {
        switch (options.method) {
            case FetchRequestMethodEnum.GET:
                return this.axiosInstance.get(options.url)
            case FetchRequestMethodEnum.POST:
                return this.axiosInstance.post(options.url, options.data)
        }
    }

    public tokenize(data: any) {
        const e = this.validateData(data)
        if (e) return Promise.reject(e)
        const converted = this.prepare(data)
        return this.axiosInstance.post('/tokenize', {
            random: this.random,
            values: converted.data
        })
    }

    public detokenize(field: IFieldDefinition, token: string) {
        return this.axiosInstance.post('/detokenize', {
            random: this.random,
            token: token,
            permanent: field.permanent || false
        })
    }

    protected validateData(data: IFrameData[]): Error | undefined {
        try {
            data.forEach((item) => {
                if (SUPPORTED_FIELDS[item.field].regex) {
                    const regExp = new RegExp(
                        SUPPORTED_FIELDS[item.field].regex
                    )
                    if (!item.value.match(regExp)) {
                        const regexMessage =
                            SUPPORTED_FIELDS[item.field].regexMessage ||
                            `Invalid ${item.field}`
                        throw new Error(`${regexMessage}: ${item.name}`)
                    }
                }
            })
        } catch (e) {
            return e
        }
    }

    protected prepare(data: IFrameData[]): {
        data: { [key: string]: { value: string; permanent: boolean } }
        empty: { [key: string]: '' }
    } {
        const dataToTokenize: {
            [key: string]: { value: string; permanent: boolean }
        } = {}
        const empty: { [key: string]: '' } = {}
        data.forEach((item) => {
            if (item.value) {
                dataToTokenize[item.name] = {
                    value: item.value,
                    permanent: SUPPORTED_FIELDS[item.field].permanent || false
                }
            } else {
                empty[item.name] = ''
            }
        })
        return { data: dataToTokenize, empty: empty }
    }
}
