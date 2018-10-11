import { keyBy } from 'lodash'
import { stringify } from 'qs'

import {
    SgHttpActionTypes,
    SgHttpRequest,
    SgHttpResponse,
    SgHttpDependencies,
    SgHttpError,
    SgHttpRequestConfigured,
} from './interfaces'
import { SG_HTTP_JSON_PARSE_ERROR } from './constants'

const makeAction = (base: string, action: string) =>
    `@@rx-http/${`${base}_${action}`.toUpperCase()}`

export const createSgHttpActionTypes = (
    base: string,
    actions: (keyof SgHttpActionTypes)[] = [
        'ERROR',
        'REQUEST',
        'SUCCESS',
        'CANCEL',
        'FINALLY',
    ],
): SgHttpActionTypes =>
    actions.reduce(
        (acc: any, action: string) => ({
            ...acc,
            [action]: makeAction(base, action),
        }),
        {},
    )

const getJsonFromResponse = async (response: Response, json: boolean) => {
    try {
        return json ? await response.json() : response.body
    } catch (parseError) {
        if (json) {
            const error: SgHttpError = {
                response,
                body: SG_HTTP_JSON_PARSE_ERROR,
            }
            throw error
        }
        return response.body
    }
}

export const sgHttpFetch = (
    sgHttpRequest: SgHttpRequestConfigured,
    { fetch }: SgHttpDependencies,
): Observable<SgHttpResponse> =>
    from(
        (async (): Promise<SgHttpResponse> => {
            try {
                const {
                    url,
                    method,
                    query,
                    body,
                    mode,
                    cache,
                    json,
                } = sgHttpRequest

                const headers = new Headers(sgHttpRequest.headers)

                const urlWithParams =
                    query && Object.keys(query).length > 0
                        ? `${url}?${stringify(query)}`
                        : url

                const request = new Request(urlWithParams, {
                    body: json ? JSON.stringify(body) : body,
                    method,
                    headers,
                    mode,
                    cache,
                })

                const response = await fetch(request)
                const data = await getJsonFromResponse(response, json)

                if (!response.ok) {
                    const error: SgHttpError = {
                        response,
                        body: data,
                    }
                    throw error
                }
                return {
                    response,
                    data,
                }
            } catch (err) {
                console.error(err)
                throw err
            }
        })(),
    )
