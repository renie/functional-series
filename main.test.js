import assert from 'assert'
import chai from 'chai'
import spies from 'chai-spies'

const main = require('./main')

chai.use(spies)
const expect = chai.expect

describe('Main', () => {
    it('should return true', () => {
        const logFn = () => {}
        const spyFn = chai.spy(logFn)
        main({ logFn: spyFn })
        expect(spyFn).to.have.been.called.exactly(1)
    })
})
