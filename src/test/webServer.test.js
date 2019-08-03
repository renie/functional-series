import chai from 'chai'
import spies from 'chai-spies'

import {
    setRoute,
    startServer,
    getExpressInstance
} from '../webServer'

chai.use(spies)
const expect = chai.expect

describe('Web Server', () => {
    it('should create and instance of lib', () => {
        const logFn = () => {}
        const spyFn = chai.spy(logFn)
        getExpressInstance(spyFn)
        expect(spyFn).to.have.been.called.exactly(1)
    })

    it('should set a route to instance', () => {
        const getFn = () => {}
        const spyFn = chai.spy(getFn)
        const expressInstance = {
            get: spyFn
        }

        setRoute({ expressInstance })
        expect(spyFn).to.have.been.called.with('/')
    })

    it('should start server on right port', () => {
        const getFn = () => {}
        const spyFn = chai.spy(getFn)
        const expressInstance = {
            listen: spyFn
        }

        startServer({ expressInstance, port: 2000 })
        expect(spyFn).to.have.been.called.with(2000)
    })
})
1
