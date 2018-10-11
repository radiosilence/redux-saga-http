/* tslint:disable:no-implicit-dependencies */
import { find } from 'lodash'
import { toArray } from 'sgjs/operators'
import { ActionsObservable } from 'redux-observable'
import { TestScheduler } from 'sgjs/testing'

import fetchMock from 'fetch-mock'

import { createHttpRequestEpic, startRequestEpic } from '../src/epics'

import { sgHttpGet } from '../src/actions'

import { createSgHttpActionTypes } from '../src/utils'

const BASE_URL = 'https://not.a.real.domain'

const ACTION_TYPES = createSgHttpActionTypes('TEST')

const httpRequestEpic = createHttpRequestEpic(() => ({
    baseUrl: BASE_URL,
    json: true,
}))

describe('startRequestEpic', () => {
    it('should emit a request action', async () => {
        const action$ = ActionsObservable.of(
            sgHttpGet('/potatoes', ACTION_TYPES),
        )
        const expectedOutputAction = {
            type: ACTION_TYPES.REQUEST,
        }

        return startRequestEpic(action$)
            .pipe(toArray())
            .subscribe((actualOutputActions: any[]) => {
                expect(actualOutputActions[0]).toMatchObject(
                    expectedOutputAction,
                )
            })
    })
})

describe('httpRequestEpic', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
        // somehow assert the two objects are equal
        // e.g. with chai `expect(actual).deep.equal(expected)`
    })
    beforeEach(() => {
        fetchMock.mock(`${BASE_URL}/potatoes`, [{ id: 1, name: 'barry' }])
        fetchMock.mock(`${BASE_URL}/potatoes/1`, { id: 1, name: 'barry' })
        fetchMock.mock(`${BASE_URL}/potatoes/2`, 404)
        fetchMock.mock(`${BASE_URL}/potatoes/3`, 'argh')
        fetchMock.mock(`${BASE_URL}/message`, {
            thanks: 'Thank you for your valuable input',
        })
        fetchMock.mock(`${BASE_URL}/broken`, 500)
        fetchMock.mock(`${BASE_URL}/post`, (req: any, opts: any) => req.body)
        fetchMock.mock(`${BASE_URL}/delete/1`, '"ok"')
        fetchMock.mock(`${BASE_URL}/patch/1`, (req: any) => ({
            id: 1,
            name: JSON.parse(req.body).name,
        }))
    })

    afterEach(() => {
        fetchMock.restore()
    })

    // it('should get a response success', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes', ACTION_TYPES),
    //     )
    //     const expectedOutputAction = {
    //         type: ACTION_TYPES.SUCCESS,
    //         result: [{ id: 1, name: 'barry' }],
    //     }

    //     const obs = httpRequestEpic(action$, null, { fetch }).pipe(toArray())
    //     console.log(obs)
    //     obs.subscribe((actualOutputActions: any[]) => {
    //         console.error('actual output actions', actualOutputActions)
    //         const successAction = find(
    //             actualOutputActions,
    //             (action) => action.type === ACTION_TYPES.SUCCESS,
    //         )
    //         expect(successAction).toMatchObject(expectedOutputAction)
    //         done()
    //     })
    // })

    // it('should get a global response success', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes', ACTION_TYPES),
    //     )
    //     const expectedOutputAction = {
    //         type: '@@sg-http/SUCCESS',
    //     }

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const successAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === '@@sg-http/SUCCESS',
    //             )
    //             expect(successAction).toMatchObject(expectedOutputAction)
    //             done()
    //         })
    // })

    // it('should handle not found', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes/2', ACTION_TYPES),
    //     )

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const errorAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.ERROR,
    //             )
    //             expect(errorAction.response.status).toEqual(404)
    //             done()
    //         })
    // })

    // it('should get a global error', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes/2', ACTION_TYPES),
    //     )

    //     const expectedOutputAction = {
    //         type: '@@sg-http/ERROR',
    //     }

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const errorAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === '@@sg-http/ERROR',
    //             )
    //             expect(errorAction).toMatchObject(expectedOutputAction)
    //             done()
    //         })
    // })

    // it('should handle malformed json', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes/3', ACTION_TYPES),
    //     )

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             console.log('actualOutputActions', actualOutputActions)
    //             const errorAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.ERROR,
    //             )
    //             expect(errorAction.error).toEqual(JSON_PARSE_ERROR)
    //             done()
    //         })
    // })

    // it('should handle a 500 error', (done) => {
    //     const action$ = ActionsObservable.of(sgHttpGet('/broken', ACTION_TYPES))

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const errorAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.ERROR,
    //             )
    //             expect(errorAction.response.status).toEqual(500)
    //             done()
    //         })
    // })

    // it('should post some data', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpPost('/post', ACTION_TYPES, {
    //             some: 'data',
    //         }),
    //     )
    //     const expectedOutputAction: Partial<SgHttpSuccessAction> = {
    //         type: ACTION_TYPES.SUCCESS,
    //         result: { some: 'data' },
    //     }

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const successAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.SUCCESS,
    //             )
    //             expect(successAction).toMatchObject(expectedOutputAction)
    //             expect(successAction.response.status).toEqual(200)
    //             done()
    //         })
    // })

    // it('should delete something', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpDelete('/delete/1', ACTION_TYPES),
    //     )
    //     const expectedOutputAction: Partial<SgHttpSuccessAction> = {
    //         type: ACTION_TYPES.SUCCESS,
    //         result: 'ok',
    //     }

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const successAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.SUCCESS,
    //             )
    //             expect(successAction).toMatchObject(expectedOutputAction)
    //             expect(successAction.response.status).toEqual(200)
    //             done()
    //         })
    // })

    // it('should put some data', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpPut('/patch/1', ACTION_TYPES, {
    //             id: 1,
    //             name: 'steve',
    //         }),
    //     )
    //     const expectedOutputAction: Partial<SgHttpSuccessAction> = {
    //         type: ACTION_TYPES.SUCCESS,
    //         result: { id: 1, name: 'steve' },
    //     }

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             const successAction: SgHttpErrorAction = find(
    //                 actualOutputActions,
    //                 (action) => action.type === ACTION_TYPES.SUCCESS,
    //             )
    //             expect(successAction).toMatchObject(expectedOutputAction)
    //             expect(successAction.response.status).toEqual(200)
    //             done()
    //         })
    // })

    // it('should get a response success but with no actions', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet(
    //             '/potatoes',
    //             createSgHttpActionTypes('TEST', []),
    //             {},
    //             {
    //                 request: {
    //                     actions: [],
    //                 },
    //             },
    //         ),
    //     )

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             console.log('ACTUAL OUTPUT ACTIONS', actualOutputActions)
    //             expect(actualOutputActions.length).toBe(0)
    //             done()
    //         })
    // })

    // it('should get a response success but with no global actions', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet(
    //             '/potatoes',
    //             createSgHttpActionTypes('TEST'),
    //             {},
    //             {
    //                 request: {
    //                     actions: [],
    //                 },
    //             },
    //         ),
    //     )

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             expect(actualOutputActions.length).toBe(2)
    //             done()
    //         })
    // })

    // it('should get a response success but with no local actions', (done) => {
    //     const action$ = ActionsObservable.of(
    //         sgHttpGet('/potatoes', createSgHttpActionTypes('TEST', [])),
    //     )

    //     httpRequestEpic(action$, null, { fetch })
    //         .pipe(toArray())
    //         .subscribe((actualOutputActions: any[]) => {
    //             expect(actualOutputActions.length).toBe(2)
    //             done()
    //         })
    // })
})
