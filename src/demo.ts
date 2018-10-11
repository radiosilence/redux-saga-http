import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { put, fork, takeEvery } from 'redux-saga/effects'
import { SgHttpGlobalSuccessAction } from './interfaces'
import { sgHttpGet, sgHttpPost } from './actions'
import { SG_HTTP_SUCCESS } from './constants'
import { createSgHttpActionTypes } from './utils'

import { createSgHttpSaga } from './sagas'

const POTATO = createSgHttpActionTypes('POTATO')

interface RootState {
    exampleVal: number
}

const rootReducer = (
    state: RootState = {
        exampleVal: 1,
    },
    action: any,
) => state

const sgHttpSaga = createSgHttpSaga((state: RootState) => ({
    baseUrl: 'http://localhost:3030',
    json: true,
}))

function* resultSaga(action: any) {
    console.log('got result', action)
    resultNode.innerHTML = JSON.stringify(action.result)
    yield put({ type: 'NOOP', action })
}

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk, sagaMiddleware)),
)

sagaMiddleware.run(function*() {
    yield takeEvery(SG_HTTP_SUCCESS, resultSaga)
    yield fork(sgHttpSaga)
})

const createButton = (name: string, cb: () => any) => {
    const node = document.createElement('button')
    node.innerHTML = name
    node.addEventListener('click', (event: Event) => {
        event.preventDefault()
        cb()
    })
    document.body.appendChild(node)
}

const getNode = createButton('GET', () => {
    store.dispatch(sgHttpGet('/', POTATO))
})
const getGhNode = createButton('GET github', () => {
    store.dispatch(
        sgHttpGet('/zen', POTATO, null, {
            request: {
                baseUrl: 'http://api.github.com',
            },
        }),
    )
})

const postNode = createButton('POST', () => {
    store.dispatch(
        sgHttpPost('/', POTATO, {
            some: 'data',
        }),
    )
})

const resultNode = document.createElement('pre')
resultNode.style.height = '400px'
resultNode.style.width = '500px'
resultNode.style.border = '1px solid #ccc'
document.body.appendChild(resultNode)

document.body.style.width = '500px'
document.body.style.margin = 'auto'
