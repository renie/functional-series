import chai from 'chai'
import spies from 'chai-spies'

import { setRoute, setAllRoutes } from '../mainRouter'

chai.use(spies)
const expect = chai.expect

describe('General Routes', () => {
    it('Should call function for every route', () => {
        const fn = () => {}
        const routes = [1,2,3,4,5]
        const spyFn = chai.spy(fn)
        setAllRoutes({ routes, setRouteFn: spyFn })

        expect(spyFn).to.have.been.called.exactly(5)
    })

    it('Should call function for setting route', () => {
        const fn = () => {}
        const spyFn = chai.spy(fn)
        const instance = {
            get: spyFn
        }
        const route = {
            method: 'get'
        }

        setRoute({ route, expressInstance: instance })

        expect(spyFn).to.have.been.called.exactly(1)
    })
})
