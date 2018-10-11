import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { put, fork, takeEvery } from 'redux-saga/effects'
import { sgHttpGet, sgHttpPost } from './actions'
import { SG_HTTP_SUCCESS } from './constants'
import { createSgHttpActionTypes } from './utils'
import { createSgHttpSaga } from './sagas'
import { SgHttpGlobalSuccessAction } from 'interfaces'

// Action Types
const POTATO = createSgHttpActionTypes('POTATO')

// Actions
const getAction = () => sgHttpGet('/', POTATO)

// User defined sagas
interface MyApiResponse {
    status: boolean
}

function* resultSaga(action: SgHttpGlobalSuccessAction<MyApiResponse>) {
    resultNode.innerHTML = JSON.stringify(action.result)
    yield put({ type: 'NOOP', action })
}

// Setup

const sgHttpSaga = createSgHttpSaga(() => ({
    baseUrl: 'http://localhost:3030',
    json: true,
}))

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    (
        state = {
            exampleVal: 1,
        },
        action: any,
    ) => state,
    composeEnhancers(applyMiddleware(thunk, sagaMiddleware)),
)

sagaMiddleware.run(function*() {
    yield takeEvery(SG_HTTP_SUCCESS, resultSaga)
    yield fork(sgHttpSaga)
})

// DOM stuff

const createButton = (name: string, cb: () => any) => {
    const node = document.createElement('button')
    node.innerHTML = name
    node.addEventListener('click', (event: Event) => {
        event.preventDefault()
        cb()
    })
    document.body.appendChild(node)
}

createButton('GET', () => {
    store.dispatch(getAction())
})

createButton('POST', () => {
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
