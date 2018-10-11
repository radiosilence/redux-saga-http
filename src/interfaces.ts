import {
    SG_HTTP_REQUEST,
    SG_HTTP_SUCCESS,
    SG_HTTP_ERROR,
    SG_HTTP_FINALLY,
} from './constants'

export type SgHttpSuccessGlobalActionType = typeof SG_HTTP_SUCCESS
export type SgHttpErrorGlobalActionType = typeof SG_HTTP_ERROR
export type SgHttpRequestGlobalActionType = typeof SG_HTTP_REQUEST
export type SgHttpFinallyGlobalActionType = typeof SG_HTTP_FINALLY

export type SgHttpRequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate'

export type SgHttpRequestCache =
    | 'default'
    | 'no-cache'
    | 'no-store'
    | 'reload'
    | 'force-cache'

export interface Dictionary<T> {
    [key: string]: T
}

export type HeadersPayload = Dictionary<string>

export type SgHttpConfigFactory<T> = (state?: T | void) => SgHttpRequestBase

export type SgHttpArgs<T = any> = Dictionary<T> | undefined

export interface SgHttpStartRequestAction {
    type: string
    args: SgHttpArgs
}
export interface SgHttpGlobalSuccessAction {
    type: SgHttpSuccessGlobalActionType
    response: SgHttpResponse
    key?: string
    args: SgHttpArgs
}

export interface SgHttpError {
    response: Response
    body: string | Dictionary<any>
}

export interface SgHttpSuccessAction<T = any> {
    type: string
    result: T
    response: Response
    args: SgHttpArgs
}

export interface SgHttpErrorAction {
    type: string
    error: string | Dictionary<any>
    response: Response
    args?: SgHttpArgs
}

export interface SgHttpGlobalErrorAction {
    type: SgHttpErrorGlobalActionType
    error: SgHttpError
    args?: SgHttpArgs
}

export interface SgHttpFinallyAction {
    type: string
    args: SgHttpArgs
}

export interface SgHttpGlobalFinallyAction {
    type: SgHttpFinallyGlobalActionType
    args: SgHttpArgs
}

export interface SgHttpRequestAction {
    type: SgHttpRequestGlobalActionType
    actionTypes: SgHttpActionTypes
    request: SgHttpRequest
    key?: string
    args?: SgHttpArgs
}

export type SgHttpGlobalActionType =
    | SgHttpSuccessGlobalActionType
    | SgHttpErrorGlobalActionType
    | SgHttpRequestGlobalActionType
    | SgHttpFinallyGlobalActionType

export interface SgHttpRequestActionConfigured extends SgHttpRequestAction {
    request: SgHttpRequestConfigured
}

export interface SgHttpActionTypes {
    REQUEST: string
    SUCCESS: string
    ERROR: string
    CANCEL: string
    FINALLY: string
}

export type QueryStringable =
    | string
    | number
    | boolean
    | object
    | undefined
    | null

export interface SgHttpQueryParams {
    [key: string]: QueryStringable | QueryStringable[]
}

export interface SgHttpRequestConfig {
    request?: SgHttpRequestBase
    args?: SgHttpArgs
    key?: string
}

export interface SgHttpRequestBase {
    query?: SgHttpQueryParams | null
    body?: any
    headers?: HeadersPayload
    extraHeaders?: HeadersPayload
    mode?: SgHttpRequestMode
    cache?: SgHttpRequestCache
    baseUrl?: string
    json?: boolean
    actions?: SgHttpGlobalActionType[]
}

export interface SgHttpRequest extends SgHttpRequestBase {
    url: string
    method: string
    json?: boolean
}

export interface SgHttpRequestConfigured extends SgHttpRequest {
    json: boolean
    actions: SgHttpGlobalActionType[]
}

export interface SgHttpResponse {
    response: Response
    data: any
}

export type SgHttpAction =
    | { type: string; args: SgHttpArgs }
    | SgHttpGlobalErrorAction
    | SgHttpErrorAction
    | SgHttpRequestAction

/* Actions */
export type SgHttpGet = (
    path: string,
    actionTypes: SgHttpActionTypes,
    query?: SgHttpQueryParams | null,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type SgHttpPost = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type SgHttpPut = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type SgHttpPatch = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type SgHttpDelete = (
    path: string,
    actionTypes: SgHttpActionTypes,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type SgHttpHead = (
    path: string,
    actionTypes: SgHttpActionTypes,
    config?: SgHttpRequestConfig,
) => SgHttpRequestAction

export type Fetch = (
    input: RequestInfo,
    init?: RequestInit,
) => Promise<Response>
export interface SgHttpDependencies {
    fetch: Fetch
}
