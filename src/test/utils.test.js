import chai from 'chai'
import spies from 'chai-spies'

import { log } from '../utils'

chai.use(spies)
const expect = chai.expect

describe('Utils', () => {
    it('should log', () => {
        const logFn = () => {}
        const message = 'New message'
        const spyFn = chai.spy(logFn)
        log({ message, logFn: spyFn })

        expect(spyFn).to.have.been.called.exactly(1)
        expect(spyFn).to.have.been.called.with(message)
    })
})
