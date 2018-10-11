import {
    SG_HTTP_REQUEST,
    SG_HTTP_SUCCESS,
    SG_HTTP_ERROR,
    SG_HTTP_FINALLY,
} from './constants'

import {
    SgHttpActionTypes,
    SgHttpResponse,
    SgHttpRequest,
    SgHttpRequestAction,
    SgHttpRequestBase,
    SgHttpRequestConfig,
    SgHttpQueryParams,
    SgHttpError,
    SgHttpArgs,
    SgHttpGlobalActionType,
    SgHttpRequestGlobalActionType,
    SgHttpRequestActionConfigured,
    SgHttpGlobalErrorAction,
    SgHttpErrorAction,
    SgHttpSuccessAction,
    SgHttpGlobalSuccessAction,
    SgHttpFinallyAction,
    SgHttpGlobalFinallyAction,
} from './interfaces'

const DEFAULT_GLOBAL_ACTIONS: SgHttpGlobalActionType[] = [
    SG_HTTP_REQUEST,
    SG_HTTP_SUCCESS,
    SG_HTTP_ERROR,
    SG_HTTP_FINALLY,
]

export const sgHttpRequest = (
    request: SgHttpRequest,
    actionTypes: SgHttpActionTypes,
    args?: {},
    key?: string,
): SgHttpRequestAction => ({
    type: SG_HTTP_REQUEST as SgHttpRequestGlobalActionType,
    actionTypes,
    key,
    request,
    args,
})

export const sgHttpRequestConfigured = (
    config: SgHttpRequestBase,
    action: SgHttpRequestAction,
): SgHttpRequestActionConfigured => ({
    ...action,
    type: SG_HTTP_REQUEST as SgHttpRequestGlobalActionType,
    request: {
        json: true,
        actions: DEFAULT_GLOBAL_ACTIONS,
        ...config,
        ...action.request,
        url: `${action.request.baseUrl || config.baseUrl}${action.request.url}`,
        headers: action.request.headers || {
            ...config.headers,
            ...action.request.extraHeaders,
        },
    },
})

export const sgHttpGet = (
    path: string,
    actionTypes: SgHttpActionTypes,
    query?: SgHttpQueryParams | null,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'GET',
            query,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpPost = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'POST',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpPut = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'PUT',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpPatch = <T>(
    path: string,
    actionTypes: SgHttpActionTypes,
    body?: T,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'PATCH',
            body,
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpDelete = (
    path: string,
    actionTypes: SgHttpActionTypes,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'DELETE',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpHead = (
    path: string,
    actionTypes: SgHttpActionTypes,
    config: SgHttpRequestConfig = {},
): SgHttpRequestAction =>
    sgHttpRequest(
        {
            ...config.request,
            url: path,
            method: 'HEAD',
        },
        actionTypes,
        config.args,
        config.key,
    )

export const sgHttpStartRequest = ({
    actionTypes,
    args,
}: SgHttpRequestAction) => ({
    type: actionTypes.REQUEST,
    args,
})

export const sgHttpSuccess = (
    { data, response }: SgHttpResponse,
    key: string | undefined,
    args: SgHttpArgs,
    actionTypes: SgHttpActionTypes,
): SgHttpSuccessAction => ({
    type: actionTypes.SUCCESS,
    result: key ? data[key] : data,
    response,
    args,
})

export const sgHttpGlobalSuccess = (
    { data, response }: SgHttpResponse,
    key: string | undefined,
    args: SgHttpArgs,
): SgHttpGlobalSuccessAction => ({
    type: SG_HTTP_SUCCESS,
    result: key ? data[key] : data,
    response,
    key,
    args,
})

export const sgHttpError = (
    error: SgHttpError,
    args: SgHttpArgs,
    actionTypes: SgHttpActionTypes,
): SgHttpErrorAction => ({
    type: actionTypes.ERROR,
    error: error.body,
    response: error.response,
    args,
})

export const sgHttpGlobalError = (
    error: SgHttpError,
    args: object | undefined,
): SgHttpGlobalErrorAction => ({
    type: SG_HTTP_ERROR,
    args,
    error,
})

export const sgHttpFinally = (
    args: SgHttpArgs,
    actionTypes: SgHttpActionTypes,
): SgHttpFinallyAction => ({
    type: actionTypes.FINALLY,
    args,
})

export const sgHttpGlobalFinally = (
    args: SgHttpArgs,
): SgHttpGlobalFinallyAction => ({
    type: SG_HTTP_FINALLY,
    args,
})
