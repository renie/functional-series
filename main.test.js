import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

const main = require('./main')

chai.use(spies)
const expect = chai.expect

describe('Main', () => {
    it('should return true', () => {
        const instance = { }
        const getExpressInstanceFn = () => instance
        const getExpressInstanceFnSpy = chai.spy(getExpressInstanceFn)

        const setRouteFn = ({ expressInstance }) => expressInstance
        const setRouteFnSpy = chai.spy(setRouteFn)

        const startServerFn = () => {}
        const startServerFnSpy = chai.spy(startServerFn)

        main({
            expressLib: {},
            getExpressInstanceFn: getExpressInstanceFnSpy,
            setRouteFn: setRouteFnSpy,
            startServerFn: startServerFnSpy,
            port: 2000
        })

        expect(getExpressInstanceFnSpy).to.have.been.called.exactly(1)
        expect(getExpressInstanceFnSpy).to.have.been.called.with({})

        expect(setRouteFnSpy).to.have.been.called.exactly(1)
        expect(setRouteFnSpy).to.have.been.called.with({expressInstance: instance})

        expect(startServerFnSpy).to.have.been.called.exactly(1)
        expect(startServerFnSpy).to.have.been.called.with({expressInstance: instance, port: 2000})

    })
})
