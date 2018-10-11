import { includes, values } from 'lodash'
import {
    take,
    takeEvery,
    call,
    put,
    select,
    cancel,
    cancelled,
} from 'redux-saga/effects'

import {
    SgHttpRequestAction,
    SgHttpConfigFactory,
    SgHttpRequestActionConfigured,
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

function* httpRequest({
    request,
    actionTypes,
    key,
    args,
}: SgHttpRequestActionConfigured) {
    try {
        const response = yield call(sgHttpFetch, request)
        yield put(sgHttpGlobalSuccess(response, key, args))
        yield put(sgHttpSuccess(response, key, args, actionTypes))
        yield put(sgHttpGlobalFinally(args))
        yield put(sgHttpFinally(args, actionTypes))
    } catch (error) {
        yield put(sgHttpGlobalError(error, args))
        yield put(sgHttpError(error, args, actionTypes))
        yield put(sgHttpGlobalFinally(args))
        yield put(sgHttpFinally(args, actionTypes))
    }
}

export const createHttpRequestSaga = <T>(config: SgHttpConfigFactory<T>) =>
    function*() {
        while (true) {
            const action = yield take(SG_HTTP_REQUEST)
            const state = yield select()
            yield call(
                httpRequest,
                sgHttpRequestConfigured(
                    state ? config(state) : config(),
                    action,
                ),
            )
        }
    }

export function* startRequestSaga(request: SgHttpRequestAction) {
    yield put(sgHttpStartRequest(request))
}

export const createSgHttpSaga = <T>(config: SgHttpConfigFactory<T>) =>
    function*() {
        yield takeEvery(SG_HTTP_REQUEST, startRequestSaga)
        yield createHttpRequestSaga<T>(config)
    }
