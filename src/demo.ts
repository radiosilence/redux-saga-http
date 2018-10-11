import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { SgHttpGlobalSuccessAction } from './interfaces'
import { sgHttpGet, sgHttpPost } from './actions'
import { SG_HTTP_SUCCESS } from './constants'
import { createSgHttpActionTypes } from './utils'

import { createSgHttpEpic } from './sagas'

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

const sgHttpEpic = createSgHttpEpic((state: RootState) => ({
    baseUrl: 'http://localhost:3030',
    json: true,
}))

const resultEpic = (action$: ActionsObservable<SgHttpGlobalSuccessAction>) =>
    action$.pipe(
        ofType(SG_HTTP_SUCCESS),
        map((result) => {
            resultNode.innerHTML = JSON.stringify(result.response.data)
            return { type: 'NOOP' }
        }),
    )

const epicMiddleware = createEpicMiddleware({ dependencies: { fetch } })

const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk, epicMiddleware)),
)

epicMiddleware.run(combineEpics(sgHttpEpic))

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
