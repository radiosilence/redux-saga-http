import { createSgHttpActionTypes, sgHttpFetch } from '../src/utils'

describe('createSgHttpActionTypes', () => {
    const desiredActionTypes = {
        ERROR: '@@sg-http/TEST_ERROR',
        REQUEST: '@@sg-http/TEST_REQUEST',
        SUCCESS: '@@sg-http/TEST_SUCCESS',
        CANCEL: '@@sg-http/TEST_CANCEL',
        FINALLY: '@@sg-http/TEST_FINALLY',
    }
    it('should create an action types object', () => {
        expect(createSgHttpActionTypes('TEST')).toMatchObject(
            desiredActionTypes,
        )
    })
    it('should create an action types object and uppercase string', () => {
        expect(createSgHttpActionTypes('test')).toMatchObject(
            desiredActionTypes,
        )
    })
    it('should fail to create the wrong action types', () => {
        expect(createSgHttpActionTypes('potato')).not.toMatchObject(
            desiredActionTypes,
        )
    })

    it('should create custom action types', () => {
        expect(
            createSgHttpActionTypes('test', ['ERROR', 'SUCCESS']),
        ).toMatchObject({
            ERROR: '@@sg-http/TEST_ERROR',
            SUCCESS: '@@sg-http/TEST_SUCCESS',
        })
    })
})
