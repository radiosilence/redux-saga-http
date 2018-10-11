import { includes, values } from 'lodash'

import {
    SgHttpRequestAction,
    SgHttpActionTypes,
    SgHttpResponse,
    SgHttpDependencies,
    SgHttpConfigFactory,
    SgHttpRequestActionConfigured,
    SgHttpError,
    SgHttpAction,
    SgHttpRequestConfigured,
    SgHttpStartRequestAction,
} from './interfaces'

import {
    sgHttpRequestConfigured,
    sgHttpSuccess,
    sgHttpGlobalSuccess,
    sgHttpError,
    sgHttpGlobalError,
    sgHttpFinally,
    sgHttpGlobalFinally,
    sgHttpStartRequest,
} from './actions'

import { SG_HTTP_REQUEST } from './constants'

import { sgHttpFetch } from './utils'

const filterActions = (
    request: SgHttpRequestConfigured,
    actionTypes: SgHttpActionTypes,
) => ({ type }: SgHttpAction) =>
    includes(request.actions, type) || includes(values(actionTypes), type)

const httpRequest = (
    action$: ActionsObservable<SgHttpAction>,
    { request, actionTypes, key, args }: SgHttpRequestActionConfigured,
    dependencies: SgHttpDependencies,
) =>
    sgHttpFetch(request, dependencies).pipe(
        mergeMap((response: SgHttpResponse) =>
            [
                sgHttpGlobalSuccess(response, key, args),
                sgHttpSuccess(response, key, args, actionTypes),
                sgHttpGlobalFinally(args),
                sgHttpFinally(args, actionTypes),
            ].filter(filterActions(request, actionTypes)),
        ),
        takeUntil(action$.ofType(actionTypes.CANCEL)),
        catchError((error: SgHttpError) =>
            [
                sgHttpGlobalError(error, args),
                sgHttpError(error, args, actionTypes),
                sgHttpGlobalFinally(args),
                sgHttpFinally(args, actionTypes),
            ].filter(filterActions(request, actionTypes)),
        ),
    )

export const createHttpRequestEpic = <T>(
    config: SgHttpConfigFactory<T>,
): Epic<SgHttpAction> => (
    action$: ActionsObservable<SgHttpAction>,
    state$: StateObservable<T | void>,
    dependencies: SgHttpDependencies,
): Observable<SgHttpAction> =>
    action$.pipe(
        ofType(SG_HTTP_REQUEST),
        mergeMap((action: SgHttpRequestAction) =>
            httpRequest(
                action$,
                sgHttpRequestConfigured(
                    state$ ? config(state$.value) : config(),
                    action,
                ),
                dependencies,
            ),
        ),
    )

export const startRequestEpic = (
    action$: ActionsObservable<SgHttpRequestAction>,
): Observable<SgHttpStartRequestAction> =>
    action$.pipe(ofType(SG_HTTP_REQUEST), map(sgHttpStartRequest))

export const createSgHttpEpic = <T>(config: SgHttpConfigFactory<T>) =>
    combineEpics(createHttpRequestEpic<T>(config), startRequestEpic)
